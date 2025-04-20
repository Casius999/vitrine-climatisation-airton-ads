from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.background import BackgroundScheduler
import pytz

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/reviews")
ALLOVOISIN_API_KEY = os.getenv("ALLOVOISIN_API_KEY", "dummy-key")
ALLOVOISIN_PROFILE_ID = "florian-c-compain"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modèles SQLAlchemy
class ReviewDB(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)
    author = Column(String)
    rating = Column(Float)
    content = Column(Text)
    date = Column(DateTime)
    source = Column(String, default="allovoisin")
    compliments = Column(Text, nullable=True)  # Stockés au format JSON en tant que texte

# Créer les tables
Base.metadata.create_all(bind=engine)

# Modèles Pydantic
class ReviewBase(BaseModel):
    external_id: str
    author: str
    rating: float
    content: str
    date: datetime
    source: str = "allovoisin"
    compliments: Optional[dict] = None

class Review(ReviewBase):
    id: int
    
    class Config:
        orm_mode = True

class ReviewStats(BaseModel):
    total: int
    average_rating: float
    rating_distribution: dict

# Dépendance pour obtenir la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fonction pour scraper les avis depuis Allovoisin
def scrape_allovoisin_reviews():
    try:
        url = f"https://www.allovoisins.com/{ALLOVOISIN_PROFILE_ID}/avis"
        response = requests.get(url, headers={
            "Authorization": f"Bearer {ALLOVOISIN_API_KEY}",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        
        if response.status_code != 200:
            print(f"Erreur lors de la récupération des avis: {response.status_code}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        reviews_elements = soup.select('.review-item')
        
        reviews = []
        for element in reviews_elements:
            review_id = element.get('data-review-id')
            author = element.select_one('.review-author').text.strip()
            rating_element = element.select_one('.review-rating')
            rating = float(rating_element.get('data-rating', 0))
            content = element.select_one('.review-content').text.strip()
            date_str = element.select_one('.review-date').text.strip()
            date = datetime.strptime(date_str, "%d/%m/%Y")
            
            # Récupérer les compliments
            compliments = {}
            compliment_elements = element.select('.review-badge')
            for comp_element in compliment_elements:
                comp_type = comp_element.get('data-type')
                comp_count = comp_element.select_one('.badge-count').text.strip()
                compliments[comp_type] = int(comp_count)
            
            reviews.append({
                "external_id": review_id,
                "author": author,
                "rating": rating,
                "content": content,
                "date": date,
                "source": "allovoisin",
                "compliments": compliments
            })
        
        return reviews
    except Exception as e:
        print(f"Erreur lors du scraping des avis: {str(e)}")
        return []

# Fonction pour synchroniser les avis
def sync_reviews(db: Session):
    reviews = scrape_allovoisin_reviews()
    
    for review_data in reviews:
        external_id = review_data["external_id"]
        
        # Vérifier si l'avis existe déjà
        existing_review = db.query(ReviewDB).filter(ReviewDB.external_id == external_id).first()
        
        if existing_review:
            # Mettre à jour l'avis existant si nécessaire
            for key, value in review_data.items():
                if key != "external_id":
                    setattr(existing_review, key, value)
            db.commit()
        else:
            # Créer un nouvel avis
            new_review = ReviewDB(**review_data)
            db.add(new_review)
            db.commit()
    
    print(f"Synchronisation terminée: {len(reviews)} avis traités")

# Application FastAPI
app = FastAPI(title="Service d'avis - Vitrine Climatisation Airton ADS")

# Routes
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/reviews", response_model=List[Review])
def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    min_rating: Optional[float] = Query(None, ge=1, le=5),
    db: Session = Depends(get_db)
):
    query = db.query(ReviewDB)
    
    if min_rating is not None:
        query = query.filter(ReviewDB.rating >= min_rating)
    
    return query.order_by(ReviewDB.date.desc()).offset(skip).limit(limit).all()

@app.get("/api/reviews/stats", response_model=ReviewStats)
def get_review_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(ReviewDB.id)).scalar()
    avg_rating = db.query(func.avg(ReviewDB.rating)).scalar() or 0.0
    
    # Distribution des notes
    distribution = {}
    for rating in range(1, 6):
        count = db.query(func.count(ReviewDB.id)).filter(ReviewDB.rating == rating).scalar()
        percentage = (count / total * 100) if total > 0 else 0
        distribution[str(rating)] = round(percentage, 1)
    
    return {
        "total": total,
        "average_rating": round(avg_rating, 1),
        "rating_distribution": distribution
    }

@app.get("/api/reviews/featured", response_model=List[Review])
def get_featured_reviews(limit: int = Query(3, ge=1, le=10), db: Session = Depends(get_db)):
    # Sélectionner les avis avec 5 étoiles et des compliments
    return db.query(ReviewDB).filter(ReviewDB.rating >= 4.5).order_by(ReviewDB.date.desc()).limit(limit).all()

# Planifier la synchronisation périodique des avis
scheduler = BackgroundScheduler(timezone=pytz.UTC)
scheduler.add_job(sync_reviews, 'interval', hours=6, args=[SessionLocal()])
scheduler.start()

# Synchroniser une première fois au démarrage
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        sync_reviews(db)
    finally:
        db.close()
