# Stratégie de Développement - Vitrine Climatisation Airton ADS

## Introduction

Ce document décrit la stratégie de développement et la structure du projet de page web vitrine pour l'installation de climatisation Airton avec technologie ReadyClim.

## Structure du Projet

Le projet est organisé selon la structure suivante :

```
vitrine-climatisation-airton-ads/
├── assets/            # Ressources statiques (images, logos, icônes)
├── css/               # Feuilles de style
│   ├── styles.css     # Styles principaux
│   └── responsive.css # Styles responsives
├── js/                # Scripts JavaScript
│   ├── main.js        # Script principal
│   ├── config.js      # Configuration des produits
│   ├── booking.js     # Système de réservation
│   └── testimonials.js# Gestion des témoignages
├── index.html         # Page principale
├── README.md          # Documentation du projet
└── .gitignore         # Exclusions Git
```

## Composants Principaux

### 1. Page d'Accueil (index.html)

La page d'accueil contient tous les éléments nécessaires pour présenter le service d'installation de climatisation et permettre la réservation :

- Section Hero avec proposition de valeur
- Avantages du service d'installation
- Explication de la technologie ReadyClim
- Configurateur de produit
- Témoignages clients
- Système de réservation de créneau avec calendrier
- Formulaire de paiement
- Zone d'intervention

### 2. Configurateur de Produit (js/config.js)

Le configurateur permet aux clients de sélectionner :
- Le modèle de climatiseur (mono-split, bi-split, tri-split, quad-split)
- La longueur de liaison ReadyClim (4m, 6m, 8m, 10m, 12m)

Le prix est calculé dynamiquement en fonction des sélections.

### 3. Système de Réservation (js/booking.js)

Le système de réservation intègre :
- Un calendrier pour choisir la date et l'heure d'intervention
- Un formulaire pour les informations client
- Un système de paiement d'acompte via Stripe (40% du montant total)

### 4. Témoignages Clients (js/testimonials.js)

Affichage dynamique des témoignages clients avec :
- Nom du client
- Date
- Évaluation (étoiles)
- Contenu du témoignage
- Source (Allovoisin)

## Intégrations API

Le projet utilise plusieurs API externes :

1. **Google Calendar API** : Pour afficher les créneaux disponibles et créer les rendez-vous
2. **Stripe API** : Pour le traitement des paiements sécurisés
3. **Google Maps API** : Pour afficher la zone d'intervention

## Stratégie de Déploiement

Le déploiement se fera en plusieurs phases :

1. **Phase de Développement** (Actuelle)
   - Mise en place de la structure et du design
   - Implémentation des fonctionnalités clés
   - Tests en environnement de développement

2. **Phase de Test**
   - Tests fonctionnels
   - Tests de compatibilité navigateur
   - Optimisation des performances

3. **Phase de Production**
   - Déploiement sur serveur de production
   - Configuration des vraies clés API
   - Mise en place des analyses de trafic
   - Lancement des campagnes ADS

## Stratégie Marketing ADS

La page vitrine servira de point de conversion central pour une stratégie ADS à 100% :

1. **Campagnes Google Ads** ciblant les recherches liées à l'installation de climatisation dans la région Bordeaux/Eysines
2. **Campagnes Facebook/Instagram** ciblant les propriétaires de maison et d'appartement dans la zone d'intervention
3. **Remarketing** pour les visiteurs n'ayant pas finalisé leur réservation

## Prochaines Étapes

- Intégration des images et assets graphiques réels
- Mise en place des vraies API keys
- Tests complets de l'interface utilisateur
- Optimisation SEO
- Configuration des outils d'analyse (Google Analytics)
