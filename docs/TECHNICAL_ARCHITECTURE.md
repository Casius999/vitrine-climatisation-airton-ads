# Architecture Technique - Vitrine Climatisation Airton ADS

## Vue d'ensemble

Ce document détaille l'architecture technique modulaire en microservices pour le projet "Vitrine Climatisation Airton ADS". Cette architecture est conçue pour être 100% opérationnelle, évolutive et maintainable.

## Architecture globale

![Architecture Microservices](./diagrams/architecture_overview.png)

L'architecture est composée des éléments suivants :

### 1. Frontend (Interface utilisateur)
- Application React.js SPA (Single Page Application)
- Responsive design (mobile-first)
- Intégration avec les microservices backend via API Gateway

### 2. Backend (Microservices)
- **Configurateur** : Gestion des options techniques et calcul des prix
- **Avis** : Intégration et affichage des avis clients
- **Réservation** : Gestion du calendrier et des créneaux
- **Paiement** : Traitement des paiements via Stripe
- **Notification** : Gestion des emails et alertes
- **Client** : Gestion des données clients

### 3. Infrastructure
- **API Gateway** : Point d'entrée unique pour les requêtes frontend
- **Service Registry** : Découverte et enregistrement des services
- **Config Server** : Gestion centralisée des configurations
- **Circuit Breaker** : Gestion des pannes et timeout
- **Message Broker** : Communication asynchrone entre services

### 4. Base de données
- Base de données dédiée à chaque microservice
- MongoDB pour les données non structurées
- PostgreSQL pour les données transactionnelles

### 5. Sécurité
- Authentification OAuth 2.0
- Chiffrement TLS/SSL
- Validation des données entrantes
- Protection contre les attaques CSRF/XSS

## Détail des microservices

### 1. Service Configurateur (configurator-service)

**Responsabilités** :
- Gestion du catalogue des climatiseurs Airton
- Configuration des options (mono-split, bi-split, etc.)
- Gestion des liaisons ReadyClim disponibles
- Calcul des prix en fonction des options

**Technologies** :
- Node.js avec Express
- MongoDB pour le stockage du catalogue
- Cache Redis pour les performances

**API Exposées** :
- `GET /api/products` : Liste des climatiseurs disponibles
- `GET /api/options` : Options de configuration disponibles
- `POST /api/configure` : Calcul du prix selon configuration
- `GET /api/product/{id}` : Détails d'un produit spécifique

### 2. Service Avis (reviews-service)

**Responsabilités** :
- Intégration avec Allovoisin pour récupération des avis
- Stockage et filtrage des avis
- Calcul des statistiques (moyenne, distribution)

**Technologies** :
- Python avec FastAPI
- PostgreSQL pour stockage des avis
- Tâches planifiées pour synchronisation

**API Exposées** :
- `GET /api/reviews` : Liste des avis clients
- `GET /api/reviews/stats` : Statistiques sur les avis
- `GET /api/reviews/featured` : Avis mis en avant

### 3. Service Réservation (booking-service)

**Responsabilités** :
- Gestion du calendrier des disponibilités
- Intégration avec Google Calendar API
- Validation des créneaux disponibles

**Technologies** :
- Java avec Spring Boot
- PostgreSQL pour le stockage des réservations
- Integration avec Google Calendar API

**API Exposées** :
- `GET /api/slots` : Créneaux disponibles
- `POST /api/booking` : Réservation d'un créneau
- `GET /api/booking/{id}` : Détails d'une réservation
- `DELETE /api/booking/{id}` : Annulation d'une réservation

### 4. Service Paiement (payment-service)

**Responsabilités** :
- Intégration avec Stripe pour paiements sécurisés
- Gestion des acomptes (40%)
- Suivi des transactions

**Technologies** :
- Node.js avec Express
- MongoDB pour stockage des transactions
- Intégration Stripe API

**API Exposées** :
- `POST /api/payment/intent` : Création d'intention de paiement
- `POST /api/payment/confirm` : Confirmation de paiement
- `GET /api/payment/{id}` : Statut d'un paiement

### 5. Service Notification (notification-service)

**Responsabilités** :
- Envoi d'emails de confirmation
- Notifications de rappel
- Alertes système

**Technologies** :
- Python avec Flask
- RabbitMQ pour file de messages
- Integration avec Gmail API

**API Exposées** :
- `POST /api/notify/email` : Envoi d'email
- `POST /api/notify/reminder` : Programmation de rappel
- `GET /api/notify/status/{id}` : Statut d'une notification

### 6. Service Client (customer-service)

**Responsabilités** :
- Gestion des informations client
- Sécurisation des données personnelles
- Historique des interactions

**Technologies** :
- Java avec Spring Boot
- PostgreSQL avec chiffrement
- Authentification JWT

**API Exposées** :
- `POST /api/customers` : Création d'un client
- `GET /api/customers/{id}` : Récupération infos client (authentifié)
- `PUT /api/customers/{id}` : Mise à jour infos client

## Communication entre services

### Synchrone (REST)
- Communication directe via API Gateway
- Format JSON pour échange de données
- Gestion d'erreurs standardisée (HTTP status codes)

### Asynchrone (Événements)
- RabbitMQ comme message broker
- Événements publiés lors de changements d'état
- Pattern Publish/Subscribe pour découplage

**Exemples d'événements** :
- `BookingCreated` : Déclenche la création d'un paiement et notification
- `PaymentConfirmed` : Déclenche l'affichage des coordonnées et notification
- `BookingCancelled` : Déclenche remboursement et notification

## Containerisation et déploiement

### Docker
- Chaque microservice dans un conteneur dédié
- Images optimisées et légères
- Docker Compose pour environnement de développement

**Exemple de Dockerfile (Service Réservation)** :
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/booking-service-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Kubernetes
- Orchestration des conteneurs
- Auto-scaling basé sur la charge
- Health checks et redémarrage automatique
- Gestion des secrets pour les API keys

**Exemple de déploiement Kubernetes** :
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: booking-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: booking-service
  template:
    metadata:
      labels:
        app: booking-service
    spec:
      containers:
      - name: booking-service
        image: airton-ads/booking-service:latest
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
        resources:
          limits:
            cpu: "0.5"
            memory: "512Mi"
          requests:
            cpu: "0.2"
            memory: "256Mi"
```

## Sécurité et conformité

### Sécurité des données
- Chiffrement des données sensibles au repos
- Authentification OAuth2 pour les API
- Validation et nettoyage des entrées utilisateur
- Protection contre injections SQL et XSS

### Conformité RGPD
- Consentement explicite pour collecte de données
- Accès et suppression des données sur demande
- Minimisation des données collectées
- Documentation des traitements de données

## Monitoring et observabilité

### Telemetry
- Prometheus pour métriques
- Grafana pour visualisation
- ELK Stack pour logs centralisés

### Alerting
- Alertes automatiques sur seuils critiques
- Intégration avec Slack/Email pour notifications

## Pipeline CI/CD

### Intégration continue
- GitHub Actions pour tests automatisés
- Validation de qualité de code (SonarQube)
- Construction automatique des images Docker

### Déploiement continu
- Déploiement automatique en environnement de staging
- Tests d'intégration automatisés
- Promotion manuelle vers production

**Exemple de workflow GitHub Actions** :
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          
      - name: Build and Test
        run: ./mvnw clean verify
        
      - name: Build Docker image
        run: docker build -t airton-ads/booking-service:latest ./booking-service
        
      - name: Push Docker image
        run: docker push airton-ads/booking-service:latest
        
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Kubernetes
        uses: actions-hub/kubectl@master
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        with:
          args: apply -f kubernetes/staging/
```

## Standards de développement

### Conventions de code
- ESLint/Prettier pour JavaScript/TypeScript
- CheckStyle pour Java
- Black pour Python
- Documentation Swagger/OpenAPI pour les API

### Tests
- Tests unitaires (>80% couverture)
- Tests d'intégration
- Tests end-to-end (Cypress)
- Tests de performance (JMeter)

### Documentation
- README détaillé pour chaque service
- Documentation API avec Swagger
- Diagrammes d'architecture (C4 model)
- Documentation des processus métier

## Plan de mise en œuvre

1. **Phase 1** : Structure de base et déploiement
   - Configuration de l'infrastructure Kubernetes
   - Mise en place des pipelines CI/CD
   - Déploiement des services de base (Auth, Config)

2. **Phase 2** : Développement des microservices core
   - Service Configurateur
   - Service Réservation
   - Service Paiement

3. **Phase 3** : Intégration des services annexes
   - Service Avis
   - Service Notification
   - Service Client

4. **Phase 4** : Front-end et intégration finale
   - Développement de l'interface utilisateur
   - Intégration des API
   - Tests complets

5. **Phase 5** : Optimisation et mise en production
   - Tests de charge
   - Optimisation des performances
   - Déploiement en production