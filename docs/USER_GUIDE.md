# Guide Utilisateur - Module de Devis et Commandes

Ce guide explique comment utiliser le module de devis, paiement et commandes fournisseurs de la plateforme Vitrine Climatisation Airton ADS.

## Table des matières

1. [Interface client](#interface-client)
   - [Configurer un produit](#configurer-un-produit)
   - [Générer un devis](#générer-un-devis)
   - [Payer l'acompte](#payer-lacompte)
   - [Suivre sa commande](#suivre-sa-commande)
2. [Interface administrateur](#interface-administrateur)
   - [Tableau de bord](#tableau-de-bord)
   - [Gestion des devis](#gestion-des-devis)
   - [Gestion des commandes fournisseurs](#gestion-des-commandes-fournisseurs)
   - [Gestion des paiements](#gestion-des-paiements)
3. [Flux de travail typique](#flux-de-travail-typique)
4. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Interface client

### Configurer un produit

1. Accédez à la page d'accueil de la vitrine
2. Sélectionnez le type de climatiseur souhaité (mono-split, bi-split, etc.)
3. Choisissez la puissance et le modèle adaptés à vos besoins
4. Sélectionnez la longueur de liaison ReadyClim nécessaire
5. Ajoutez des options supplémentaires si besoin
6. Cliquez sur "Continuer" pour passer à l'étape suivante

### Générer un devis

1. Remplissez le formulaire avec vos informations personnelles
   - Nom et prénom
   - Adresse email
   - Numéro de téléphone
   - Adresse d'installation
2. Sélectionnez une date d'installation souhaitée
3. Cliquez sur "Générer le devis"
4. Vérifiez les informations sur la page de récapitulatif du devis
5. Vous pouvez télécharger le devis au format PDF en cliquant sur le bouton dédié

### Payer l'acompte

1. Sur la page de récapitulatif du devis, cliquez sur "Payer l'acompte"
2. Vous serez redirigé vers notre interface de paiement sécurisée
3. Entrez vos informations de carte bancaire
4. Validez le paiement de l'acompte (40% du montant total)
5. Une confirmation vous sera envoyée par email avec votre devis et les détails de la commande

### Suivre sa commande

1. Après avoir payé l'acompte, vous recevrez un email avec un lien de suivi
2. Connectez-vous à votre espace client en utilisant votre email
3. Dans votre tableau de bord, vous pourrez suivre :
   - Le statut de votre commande
   - La date d'installation confirmée
   - Les étapes de paiement restantes
4. Vous recevrez une notification pour effectuer le paiement intermédiaire (30%) le jour de l'installation
5. Après l'installation, vous recevrez une notification pour le paiement final (30%)

## Interface administrateur

### Tableau de bord

Le tableau de bord vous donne une vue d'ensemble des activités commerciales :

- **Statistiques clés** : nombre de devis, montant total, montant payé, nombre de commandes
- **Graphiques** : répartition des devis par statut, répartition des commandes par statut, suivi des paiements
- **Activités récentes** : derniers devis générés, dernières commandes fournisseurs

Il est accessible depuis le menu principal de l'interface d'administration.

### Gestion des devis

#### Liste des devis

1. Accédez à la section "Devis" du menu d'administration
2. Consultez la liste des devis avec les informations principales :
   - Numéro de devis
   - Client
   - Date de création
   - Montant
   - Statut (brouillon, envoyé, accepté, annulé)
   - Statut des paiements (acompte, paiement intermédiaire, paiement final)
3. Filtrez la liste par statut ou recherchez un devis spécifique

#### Actions sur un devis

- **Voir les détails** : cliquez sur l'icône "œil" pour consulter tous les détails du devis
- **Télécharger le PDF** : cliquez sur l'icône de téléchargement pour générer le PDF
- **Envoyer par email** : cliquez sur l'icône d'email pour envoyer le devis au client
- **Créer une commande fournisseur** : cliquez sur l'icône de panier pour transformer le devis en commande

### Gestion des commandes fournisseurs

#### Liste des commandes

1. Accédez à la section "Commandes fournisseurs" du menu d'administration
2. Consultez la liste des commandes avec les informations principales :
   - Numéro de commande
   - Date de création
   - Nombre de devis liés
   - Montant total
   - Statut (en attente, envoyée, confirmée, expédiée, livrée)
   - Informations de suivi
3. Filtrez la liste par statut ou recherchez une commande spécifique

#### Actions sur une commande

- **Voir les détails** : cliquez sur l'icône "œil" pour consulter tous les détails de la commande
- **Envoyer au fournisseur** : cliquez sur l'icône d'email pour envoyer la commande à Airton
- **Marquer comme confirmée** : après confirmation par Airton, utilisez ce bouton
- **Ajouter des informations de livraison** : renseignez le transporteur, le numéro de suivi et la date estimée
- **Marquer comme livrée** : une fois la livraison effectuée, utilisez ce bouton

### Gestion des paiements

#### Suivi des paiements

1. Dans la vue détaillée d'un devis, consultez la section "Échéancier de paiement"
2. Pour chaque étape de paiement (acompte, intermédiaire, final), vous pouvez voir le statut :
   - Montant
   - État (en attente, payé, échoué)

#### Actions sur les paiements

- **Générer un lien de paiement** : pour les paiements intermédiaires et finaux, vous pouvez générer un lien à envoyer au client
- **Marquer comme payé** : si le client a payé par un autre moyen, vous pouvez manuellement marquer le paiement comme effectué

## Flux de travail typique

1. **Génération du devis**
   - Le client configure son produit sur le site vitrine
   - Le client remplit ses informations et génère un devis
   - Le client paie l'acompte (40%)

2. **Création de la commande fournisseur**
   - Automatiquement ou manuellement, une commande est créée pour Airton
   - La commande est envoyée par email à Airton
   - Airton confirme la commande

3. **Suivi de la livraison**
   - Airton expédie les produits
   - Vous renseignez les informations de suivi
   - Vous marquez la commande comme livrée à réception

4. **Installation et paiements finaux**
   - Le client est notifié pour le paiement intermédiaire le jour de l'installation
   - L'installation est réalisée
   - Le client est notifié pour le paiement final
   - Vous marquez le devis comme entièrement payé

## Résolution des problèmes courants

### Paiement échoué

1. Vérifiez les logs dans la section "Paiements" pour comprendre la raison de l'échec
2. Contactez le client pour lui proposer une solution alternative
3. Générez un nouveau lien de paiement si nécessaire

### Commande non reçue par Airton

1. Vérifiez que l'email a bien été envoyé (logs dans "Commandes")
2. Renvoyez la commande manuellement depuis la page de détail
3. Contactez directement Airton par téléphone pour confirmation

### Client ne recevant pas les emails

1. Vérifiez l'adresse email du client dans ses informations
2. Consultez les logs d'envoi d'emails dans le service de notification
3. Envoyez manuellement les informations ou contactez le client par téléphone

### Modification d'une commande

1. Pour modifier une commande déjà envoyée à Airton, contactez directement le service client Airton
2. Notez les modifications dans les "Notes" de la commande pour garder une trace
3. Mettez à jour les devis concernés si nécessaire

---

Pour toute assistance supplémentaire, contactez l'équipe de support technique.