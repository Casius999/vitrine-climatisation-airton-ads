# Module Commercial - Documentation

## Présentation

Le Module Commercial est une solution complète pour la gestion des devis, des paiements en 3 tranches et du suivi des commandes fournisseurs pour le projet "Vitrine Climatisation Airton ADS". Ce module a été conçu pour faciliter la conversion des visiteurs en clients et assurer une gestion efficace du cycle de vente complet.

## Fonctionnalités Principales

### 1. Génération et Gestion des Devis

- **Génération automatique** de devis basés sur les configurations choisies par les clients
- **Personnalisation** des devis avec les coordonnées client et les détails techniques
- **Visualisation et modification** des devis existants
- **Export PDF** des devis pour l'envoi aux clients ou l'archivage
- **Statuts de suivi** (brouillon, validé, payé, expiré, etc.)

### 2. Paiements en 3 Tranches

- **Échelonnement automatique** des paiements selon la règle suivante :
  - 40% à la commande (acompte initial)
  - 30% le jour du rendez-vous d'installation
  - 30% après l'installation complète
- **Intégration avec Stripe** pour les paiements sécurisés par carte bancaire
- **Tableau de bord** de suivi de l'état des paiements pour chaque commande
- **Notifications automatiques** pour rappeler les paiements à venir
- **Génération de factures** pour chaque paiement effectué

### 3. Suivi des Commandes Fournisseurs

- **Création automatique** des commandes auprès d'Airton après validation du devis
- **Suivi en temps réel** de l'état des commandes (commandé, confirmé, expédié, livré)
- **Gestion des numéros de suivi** et dates de livraison prévisionnelles
- **Historique complet** des étapes de chaque commande
- **Alertes automatiques** en cas de retard ou d'anomalie

## Architecture Technique

### Frontend

Le frontend utilise React avec Material-UI et s'articule autour des composants suivants :

- **QuoteManager** : Gestion de la création et validation des devis
- **QuoteDetails** : Affichage détaillé des devis
- **PaymentTracker** : Suivi des paiements en 3 tranches
- **SupplierOrderTracker** : Suivi des commandes fournisseurs
- **QuotePDFDocument** : Génération de devis au format PDF

L'état global est géré via le contexte React (QuoteContext) qui centralise les données et les actions.

### Backend

Le backend est organisé en microservices REST qui fournissent les API nécessaires :

- **Quote Service** : API pour les devis
- **Order Service** : API pour les commandes et paiements
- **Supplier Order Service** : API pour les commandes fournisseurs

Les données sont stockées dans une base MongoDB pour les documents non structurés (devis, commandes).

### Intégrations

Le module s'intègre avec différents services externes :

- **Stripe** pour le traitement des paiements
- **API Airton** pour la gestion des commandes fournisseurs (simulée dans la version actuelle)
- **Services d'emails** pour les notifications

## Guide d'Utilisation

### Génération d'un Devis

1. Accédez à la page "Devis" depuis le tableau de bord
2. Cliquez sur "Nouveau Devis"
3. Sélectionnez les options de configuration et renseignez les coordonnées client
4. Validez pour générer automatiquement le devis
5. Vérifiez les détails du devis et ajustez si nécessaire
6. Cliquez sur "Valider le devis" pour finaliser

### Suivi des Paiements

1. Depuis le détail d'un devis validé, cliquez sur "Créer une commande"
2. Accédez à l'onglet "Suivi des Paiements"
3. Pour le premier paiement (acompte), cliquez sur "Effectuer le paiement"
4. Entrez les informations de carte bancaire (via Stripe) ou sélectionnez un autre mode de paiement
5. Une fois le paiement confirmé, son statut est mis à jour automatiquement
6. Les paiements suivants sont débloqués selon le calendrier d'installation

### Gestion des Commandes Fournisseurs

1. Accédez à l'onglet "Commandes Fournisseurs"
2. Pour une nouvelle commande, cliquez sur "Nouvelle commande"
3. Sélectionnez les produits et quantités à commander
4. Validez pour créer la commande auprès du fournisseur
5. Suivez l'évolution de la commande et mettez à jour son statut à chaque étape
6. Ajoutez le numéro de suivi dès réception et les dates prévisionnelles

## Déploiement

Le module commercial est intégré au reste de l'application et utilise le même pipeline CI/CD. Pour un déploiement spécifique du module :

1. Assurez-vous que toutes les dépendances sont installées (`npm install`)
2. Configurez les variables d'environnement :
   - `REACT_APP_API_URL` : URL de l'API backend
   - `REACT_APP_STRIPE_PUBLIC_KEY` : Clé publique Stripe
   - (Autres variables spécifiques à l'environnement)
3. Lancez la compilation (`npm run build`)
4. Déployez les fichiers générés sur votre serveur web

## Sécurité

Le module commercial manipule des données sensibles et intègre plusieurs mesures de sécurité :

- Chiffrement SSL/TLS pour toutes les communications
- Tokens JWT pour l'authentification des API
- Intégration PCI-DSS via Stripe pour les paiements
- Validation des entrées côté client et serveur
- Protection CSRF pour les formulaires
- Logs d'audit pour toutes les opérations sensibles

## Roadmap et Évolutions Futures

- Intégration d'un système de signature électronique des devis
- Ajout de modes de paiement supplémentaires (virement, financement)
- Automatisation complète des commandes fournisseurs via API
- Dashboard analytique avec KPIs commerciaux
- Optimisation mobile du parcours de paiement
- Système de relance automatique pour devis non validés

## Support et Maintenance

Pour toute question ou problème concernant le module commercial :

- Consultez la documentation technique dans le dossier `docs/`
- Vérifiez les logs d'erreur dans la console ou le système de monitoring
- Contactez l'équipe technique à support@airton-installation.fr

---

*Module développé dans le cadre du projet "Vitrine Climatisation Airton ADS" - © 2025*