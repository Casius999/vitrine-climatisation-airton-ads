# Module de Devis, Paiement et Commandes Fournisseurs

Ce document présente le module de gestion commerciale et financière pour le projet **Vitrine Climatisation Airton ADS**. Le module permet de gérer les devis, les paiements échelonnés et les commandes fournisseurs auprès d'Airton.

## Architecture du Module

Le module est intégré dans l'architecture microservices existante du projet et se compose de :

1. Un nouveau service backend **commercial-service** dédié à la gestion des devis et des commandes fournisseurs
2. Des modifications du service **payment-service** existant pour gérer les paiements en 3 tranches
3. De nouvelles interfaces frontend pour la gestion de ces fonctionnalités

## Fonctionnalités

### 1. Génération Automatique de Devis

La génération automatique de devis s'effectue à partir des informations fournies par le client :

- Choix du modèle de climatiseur
- Options et configuration sélectionnées
- Informations client et adresse d'installation
- Date d'installation souhaitée

Le système calcule automatiquement :
- Le prix total TTC
- La répartition du paiement en 3 tranches (40% d'acompte, 30% le jour de l'installation, 30% après l'installation)

Le devis peut être :
- Envoyé par email au client
- Téléchargé au format PDF
- Consultable dans l'interface d'administration

### 2. Gestion des Paiements en 3 Tranches

Le système gère les 3 étapes de paiement :

- **Acompte (40%)** : Payé lors de la confirmation du devis via Stripe
- **Paiement à l'installation (30%)** : Payé le jour du rendez-vous via un lien de paiement envoyé automatiquement
- **Paiement final (30%)** : Payé après l'installation via un lien de paiement envoyé automatiquement

Chaque étape de paiement est suivie et peut être gérée depuis l'interface d'administration.

### 3. Commande Fournisseur et Collaboration avec Airton

Le module permet :

- De créer des commandes fournisseurs auprès d'Airton à partir d'un ou plusieurs devis confirmés
- De regrouper automatiquement les commandes pour optimiser les achats
- D'envoyer par email les informations de commande au format structuré à Airton
- De suivre l'état des commandes (création, confirmation, expédition, livraison)

Une commande fournisseur peut être créée :
- Manuellement depuis l'interface d'administration
- Automatiquement lorsqu'un nombre suffisant de devis avec acompte ont été validés

### 4. Gestion Centrale et Suivi des Commandes et Facturations

L'interface d'administration permet :

- De visualiser l'ensemble des devis et leur statut
- De suivre les paiements pour chaque devis
- De gérer les commandes fournisseurs
- D'envoyer des emails au client ou au fournisseur
- De générer des documents (devis PDF)

## Flux de Fonctionnement

### Flux de création d'un devis et gestion du paiement

1. Le client configure son choix de climatiseur sur le site vitrine
2. Le système génère un devis détaillé
3. Le client confirme le devis et paie l'acompte (40%)
4. Le système enregistre le paiement et met à jour le statut du devis
5. Le système vérifie si une commande fournisseur peut être créée
6. Le jour de l'installation, le système envoie un lien pour le paiement intermédiaire (30%)
7. Après l'installation, le système envoie un lien pour le paiement final (30%)

### Flux de commande fournisseur

1. Un ou plusieurs devis avec acompte payé sont sélectionnés
2. Le système crée une commande groupée
3. Un email est envoyé à Airton avec les détails de la commande
4. Le statut de la commande est suivi (confirmée, expédiée, livrée)
5. Les informations de suivi sont enregistrées et communiquées aux clients

## API du Module

### API Commercial Service

- `POST /api/quotes` : Crée un nouveau devis
- `GET /api/quotes/:id` : Récupère un devis par ID
- `GET /api/quotes` : Liste tous les devis avec filtrage
- `GET /api/quotes/:id/pdf` : Génère un PDF du devis
- `PATCH /api/quotes/:id/status` : Met à jour le statut d'un devis
- `PATCH /api/quotes/:id/payment-status` : Met à jour le statut de paiement
- `POST /api/quotes/:id/send` : Envoie le devis par email
- `POST /api/supplier-orders` : Crée une commande fournisseur
- `GET /api/supplier-orders/:id` : Récupère une commande fournisseur
- `GET /api/supplier-orders` : Liste toutes les commandes
- `PATCH /api/supplier-orders/:id/status` : Met à jour le statut d'une commande
- `POST /api/supplier-orders/:id/send` : Envoie la commande au fournisseur
- `GET /api/dashboard/summary` : Récupère un résumé des données pour le tableau de bord

### API Payment Service (mises à jour)

- `POST /api/payment/intent` : Crée une intention de paiement (ajout du quoteId et paymentType)
- `POST /api/payment/confirm` : Confirme un paiement
- `GET /api/payment/:id` : Récupère les détails d'un paiement
- `GET /api/payments/quote/:quoteId` : Liste tous les paiements pour un devis
- `POST /api/payment/create-installation-payment-link` : Crée un lien de paiement pour le jour de l'installation
- `POST /api/payment/create-final-payment-link` : Crée un lien de paiement pour le paiement final

## Configuration et Déploiement

### Variables d'environnement

**Commercial Service**
```
PORT=3003
MONGODB_URI=mongodb://localhost:27017/commercial
PAYMENT_SERVICE_URL=http://payment-service:3000
CONFIGURATOR_SERVICE_URL=http://configurator-service:3000
NOTIFICATION_SERVICE_URL=http://notification-service:3000
AIRTON_EMAIL=service-client@airton.shop
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=devis@airton-installation.fr
```

**Payment Service (ajouts)**
```
COMMERCIAL_SERVICE_URL=http://commercial-service:3003
FRONTEND_URL=http://localhost:3000
```

### Intégration Docker

Le nouveau service est intégré dans le fichier `docker-compose.yml` existant :

```yaml
  commercial-service:
    build: ./backend/commercial-service
    ports:
      - "3003:3000"
    environment:
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/commercial
      - PAYMENT_SERVICE_URL=http://payment-service:3000
      - CONFIGURATOR_SERVICE_URL=http://configurator-service:3000
      - NOTIFICATION_SERVICE_URL=http://notification-service:3000
      - AIRTON_EMAIL=service-client@airton.shop
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM}
    depends_on:
      - mongo
    restart: always
```

## Possibilités d'évolution

Le module a été conçu pour évoluer vers une automatisation complète :

1. **Automatisation complète des commandes** : API directe avec Airton pour la soumission des commandes
2. **Intégration du suivi de livraison** : API avec les transporteurs pour le suivi en temps réel
3. **Système de relances automatiques** : Relances pour les paiements en retard
4. **Tableau de bord avancé** : Statistiques et prévisions financières
5. **Intégration comptable** : Export des factures vers un logiciel de comptabilité

## Maintenance et Support

Le module inclut :

- Des logs détaillés pour le suivi des opérations
- Une gestion des erreurs robuste
- Des tests unitaires et d'intégration pour chaque fonctionnalité
- Une documentation complète du code et des API