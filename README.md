# Vitrine Climatisation Airton ADS

## Présentation

Projet de page web vitrine dédiée à une prestation d'installation de climatisation Airton avec technologie ReadyClim. Cette solution permet une installation ultra-rapide (20 minutes) sans intervention d'un frigoriste grâce à une liaison frigorifique pré-chargée en gaz R32.

## 📋 Caractéristiques du Projet

### Fonctionnalités Principales

1. **Sélection des Options Techniques**
   - Choix du modèle de climatiseur (mono-split, bisplit, trisplit, quadrisplit)
   - Sélection de la longueur de liaison ReadyClim (4m, 6m, 8m, 10m, 12m)

2. **Preuve Sociale et Crédibilité**
   - Intégration d'avis vérifiables (Allovoisin)
   - Affichage des 110+ avis positifs
   - Présentation des certifications et garanties

3. **Processus de Réservation et Paiement**
   - Module de paiement sécurisé via Stripe (acompte 40%)
   - Calendrier de réservation dynamique via Google Calendar API
   - Notifications automatiques par email après réservation

4. **Gestion des Données Client**
   - Sécurisation des informations de contact
   - Affichage des coordonnées du prestataire après confirmation
   - Conformité RGPD

5. **Zone d'Intervention**
   - Rayon de 30 km autour d'Eysines (incluant Bordeaux et CUB)
   - Affichage dynamique des communes desservies

## 🚀 Avantages Produit

- Marque française Airton (20+ ans d'expérience)
- Climatiseurs garantis 3 ans
- Installation rapide grâce à la technologie ReadyClim
- Rapport qualité-prix optimal
- Consommation énergétique optimisée

## 🏗️ Architecture Technique

### Architecture Globale
Le projet utilise une architecture modulaire en microservices :

#### Frontend
- **Interface Utilisateur** : React.js avec Material-UI
- **Routing** : React Router v6
- **Gestion d'État** : Contextes React (ConfigContext, BookingContext)
- **Modules UI** :
  - ConfiguratorModule : Sélection d'options et calcul de prix
  - ReviewsModule : Affichage des avis clients
  - BookingPaymentModule : Réservation et paiement
  - NotificationModule : Gestion des confirmations par email

#### Backend (Microservices)
1. **Configurator Service** 
   - Gestion du catalogue et des options
   - Calcul des prix
   - Tech : Node.js + Express + MongoDB

2. **Reviews Service**
   - Gestion des avis clients
   - Intégration avec Allovoisin
   - Tech : Python + FastAPI + PostgreSQL

3. **Booking Service**
   - Gestion des créneaux et réservations
   - Intégration avec Google Calendar API
   - Tech : Java + Spring Boot + PostgreSQL

4. **Payment Service**
   - Gestion des paiements via Stripe
   - Sécurisation des transactions
   - Tech : Node.js + Express + MongoDB

5. **Notification Service**
   - Gestion des emails de confirmation
   - Intégration avec Gmail API
   - Tech : Python + Flask + RabbitMQ

#### Infrastructure
- **API Gateway** : Kong pour centraliser les requêtes
- **Containerisation** : Docker pour chaque service
- **Orchestration** : Kubernetes pour le déploiement
- **CI/CD** : GitHub Actions pour automatisation
- **Bases de données** : MongoDB et PostgreSQL dédiées par service
- **Messaging** : RabbitMQ pour communication asynchrone

## 🔧 Technologies Utilisées

### Frontend
- React.js 18
- Material-UI 5
- React Router 6
- Axios pour les requêtes API
- Stripe.js pour l'intégration des paiements
- Date-fns pour la gestion des dates

### Backend
- Node.js avec Express
- Python avec FastAPI et Flask
- Java avec Spring Boot
- MongoDB pour les données non structurées
- PostgreSQL pour les données relationnelles
- RabbitMQ pour la messagerie

### APIs Externes
- Google Calendar API
- Stripe API
- Gmail API
- Allovoisin API

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- Docker et Docker Compose
- Kubernetes (pour le déploiement en production)
- Clés API pour les services externes

### Installation en Développement

```bash
# Cloner le dépôt
git clone https://github.com/Casius999/vitrine-climatisation-airton-ads.git
cd vitrine-climatisation-airton-ads

# Installer les dépendances frontend
cd frontend
npm install

# Créer un fichier .env avec les clés API
echo "REACT_APP_API_URL=http://localhost:8000" > .env
echo "REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key" >> .env

# Lancer le frontend en développement
npm start

# Dans un autre terminal, lancer les services backend
cd ..
docker-compose up -d
```

### Variables d'Environnement

Pour le développement local, créez un fichier `.env` dans le dossier `frontend` avec les variables suivantes :

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
```

### Déploiement en Production

```bash
# Déploiement Kubernetes
kubectl apply -k kubernetes/production/
```

## 📚 Documentation

Une documentation détaillée est disponible dans le dossier `docs/` :

- `TECHNICAL_ARCHITECTURE.md` : Architecture technique détaillée
- `diagrams/` : Diagrammes d'architecture
- `API_DOCUMENTATION.md` : Documentation des API

## 🔒 Sécurité

- Authentification OAuth 2.0
- Chiffrement TLS/SSL pour toutes les communications
- Protection CSRF/XSS
- Conformité RGPD
- Stockage sécurisé des données sensibles

## 📊 Monitoring et Observabilité

- Prometheus pour les métriques
- Grafana pour la visualisation
- ELK Stack pour les logs centralisés
- Alertes automatiques en cas d'incident

## 🤝 Contribuer

Pour contribuer au projet :

1. Forker le dépôt
2. Créer une branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'feat: add amazing feature'`)
4. Pousser la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Conventions de Code

Ce projet suit les conventions suivantes :
- ESLint pour la qualité du code
- Prettier pour le formatage
- Conventional Commits pour les messages de commit

## 📝 Licence

Propriétaire - Tous droits réservés

## ✨ Crédits

- Design : [À compléter]
- Développement Frontend : [À compléter]
- Développement Backend : [À compléter]
- Intégration API : [À compléter]

---

*Projet 100% opérationnel, conçu pour une conversion maximale des visiteurs en clients*