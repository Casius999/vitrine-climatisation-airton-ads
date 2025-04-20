# Vitrine Climatisation Airton ADS

## Présentation

Projet de création d'une page web vitrine dédiée à une prestation d'installation de climatisation Airton avec technologie ReadyClim. Cette solution permet une installation ultra-rapide (20 minutes) sans intervention d'un frigoriste grâce à une liaison frigorifique pré-chargée en gaz R32.

## Caractéristiques du Projet

### Fonctionnalités Principales

1. **Sélection des Options Techniques**
   - Choix du modèle de climatiseur (mono-split, bisplit, trisplit, quadrisplit)
   - Sélection de la longueur de liaison ReadyClim (4m, 6m, 8m, 10m, 12m)

2. **Preuve Sociale et Crédibilité**
   - Intégration d'avis vérifiables (Allovoisin)
   - Affichage des 110+ avis positifs

3. **Processus de Réservation et Paiement**
   - Module de paiement sécurisé via Stripe (acompte 40%)
   - Calendrier de réservation dynamique via Google Calendar API
   - Notifications automatiques par email après réservation

4. **Gestion des Données Client**
   - Sécurisation des informations de contact
   - Affichage des coordonnées du prestataire après confirmation

5. **Zone d'Intervention**
   - Rayon de 30 km autour d'Eysines (incluant Bordeaux et CUB)

6. **Stratégie d'Acquisition**
   - Optimisation pour campagnes ADS
   - Structure de conversion maximale

## Avantages Produit

- Marque française Airton (20+ ans d'expérience)
- Climatiseurs garantis 3 ans
- Installation rapide grâce à la technologie ReadyClim
- Rapport qualité-prix optimal
- Consommation énergétique optimisée

## Architecture Technique

Le projet utilise une architecture modulaire en microservices :

1. **Frontend** - Interface utilisateur React.js
2. **Backend** - Microservices :
   - Configurateur (choix produits et options)
   - Avis (gestion des témoignages)
   - Réservation (gestion calendrier)
   - Paiement (intégration Stripe)
   - Notification (emails automatiques)
   - Client (gestion données utilisateurs)

3. **Infrastructure** :
   - API Gateway (Kong)
   - Conteneurisation avec Docker
   - Orchestration avec Kubernetes
   - Bases de données dédiées par service
   - CI/CD avec GitHub Actions

Des détails complets sur l'architecture sont disponibles dans le dossier `docs/`.  
Des diagrammes d'architecture se trouvent dans `docs/diagrams/`.  
Les configurations Kubernetes sont dans le répertoire `kubernetes/`.  

## Technologies Utilisées

- **Frontend** : React.js
- **Backend** : Node.js (Express), Java (Spring Boot), Python (FastAPI)
- **Bases de données** : MongoDB, PostgreSQL
- **Messaging** : RabbitMQ
- **Cache** : Redis
- **API externes** :
  - Google Calendar API
  - Stripe API
  - Gmail API
  - Allovoisin API

## Démarrage Rapide

### Prérequis

- Docker et Docker Compose
- Kubernetes (pour le déploiement en production)
- Clés API pour les services externes

### Installation en développement

```bash
# Cloner le dépôt
git clone https://github.com/Casius999/vitrine-climatisation-airton-ads.git
cd vitrine-climatisation-airton-ads

# Lancer les services en développement
docker-compose up -d
```

### Déploiement en production

```bash
# Configuration Kubernetes
kubectl apply -k kubernetes/production/
```

## Responsables du Projet

- Développement Front-end: [À compléter]
- Intégration API: [À compléter]
- Design: [À compléter]

---

*Projet 100% opérationnel, conçu pour une conversion maximale des visiteurs en clients*