from flask import Flask, request, jsonify
import pika
import json
import os
import time
from datetime import datetime
import threading
from google.oauth2 import service_account
from googleapiclient.discovery import build
from flask_cors import CORS
import logging

# Configuration
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = int(os.getenv('RABBITMQ_PORT', 5672))
GMAIL_API_CREDENTIALS = os.getenv('GMAIL_API_CREDENTIALS', '{}')

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Modèle pour les emails
class EmailTemplate:
    BOOKING_CONFIRMATION = {
        "subject": "Confirmation de votre réservation d'installation de climatiseur Airton",
        "body": """
        <html>
        <body>
            <h1>Confirmation de réservation</h1>
            <p>Bonjour {name},</p>
            <p>Nous vous confirmons votre réservation pour l'installation de votre climatiseur Airton avec technologie ReadyClim.</p>
            <p><strong>Détails de la réservation:</strong></p>
            <ul>
                <li><strong>Date:</strong> {date}</li>
                <li><strong>Créneau horaire:</strong> {time_slot}</li>
                <li><strong>Modèle:</strong> {model}</li>
                <li><strong>Liaison ReadyClim:</strong> {liaison_length}m</li>
                <li><strong>Montant total:</strong> {total_amount}€</li>
                <li><strong>Acompte versé:</strong> {deposit_amount}€</li>
            </ul>
            <p>Un technicien vous contactera la veille de l'intervention pour confirmer l'heure exacte.</p>
            <p>Vous pouvez suivre votre réservation en cliquant sur le lien suivant: <a href="{tracking_link}">Suivi de réservation</a></p>
            <p>Merci pour votre confiance!</p>
            <p>L'équipe Airton</p>
        </body>
        </html>
        """
    },
    PAYMENT_CONFIRMATION = {
        "subject": "Confirmation de paiement - Acompte pour installation climatiseur Airton",
        "body": """
        <html>
        <body>
            <h1>Confirmation de paiement</h1>
            <p>Bonjour {name},</p>
            <p>Nous vous confirmons la réception de votre paiement d'acompte pour l'installation de votre climatiseur Airton.</p>
            <p><strong>Détails du paiement:</strong></p>
            <ul>
                <li><strong>Montant:</strong> {amount}€</li>
                <li><strong>Date:</strong> {date}</li>
                <li><strong>Méthode:</strong> {payment_method}</li>
                <li><strong>Référence transaction:</strong> {transaction_id}</li>
            </ul>
            <p>Le reste du paiement sera à régler directement à notre technicien le jour de l'installation.</p>
            <p>Voici les coordonnées de notre entreprise:</p>
            <ul>
                <li><strong>Nom:</strong> Florian C. (Compain)</li>
                <li><strong>Adresse:</strong> Le Haillan (Bechade)</li>
                <li><strong>Téléphone:</strong> 06XX XX XX XX</li>
            </ul>
            <p>Nous vous remercions pour votre confiance!</p>
            <p>L'équipe Airton</p>
        </body>
        </html>
        """
    },
    APPOINTMENT_REMINDER = {
        "subject": "Rappel - Votre installation de climatiseur Airton demain",
        "body": """
        <html>
        <body>
            <h1>Rappel d'installation</h1>
            <p>Bonjour {name},</p>
            <p>Nous vous rappelons que votre installation de climatiseur Airton est prévue pour demain.</p>
            <p><strong>Détails:</strong></p>
            <ul>
                <li><strong>Date:</strong> {date}</li>
                <li><strong>Créneau horaire:</strong> {time_slot}</li>
            </ul>
            <p>Notre technicien vous contactera dans la journée pour confirmer l'heure exacte de son passage.</p>
            <p>En cas d'empêchement, merci de nous contacter au plus vite au 06XX XX XX XX.</p>
            <p>Nous vous remercions pour votre confiance!</p>
            <p>L'équipe Airton</p>
        </body>
        </html>
        """
    }

# Fonction pour établir une connexion à RabbitMQ avec retry
def get_rabbitmq_connection(max_retries=5, retry_delay=5):
    retries = 0
    while retries < max_retries:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                host=RABBITMQ_HOST,
                port=RABBITMQ_PORT
            ))
            return connection
        except Exception as e:
            retries += 1
            logger.error(f"Tentative {retries}/{max_retries} de connexion à RabbitMQ échouée: {str(e)}")
            if retries < max_retries:
                time.sleep(retry_delay)
            else:
                raise

# Fonction pour initialiser les files RabbitMQ
def setup_rabbitmq():
    try:
        connection = get_rabbitmq_connection()
        channel = connection.channel()
        
        # Déclarer les files d'attente
        channel.queue_declare(queue='email_notifications', durable=True)
        channel.queue_declare(queue='sms_notifications', durable=True)
        
        connection.close()
        logger.info("Configuration RabbitMQ terminée avec succès")
    except Exception as e:
        logger.error(f"Erreur lors de la configuration RabbitMQ: {str(e)}")

# Fonction pour envoyer un email via l'API Gmail
def send_gmail(to, subject, body):
    try:
        credentials_info = json.loads(GMAIL_API_CREDENTIALS)
        credentials = service_account.Credentials.from_service_account_info(
            credentials_info,
            scopes=['https://www.googleapis.com/auth/gmail.send']
        )
        
        # Déléguer à un compte utilisateur
        delegated_credentials = credentials.with_subject('contact@airton-climatisation.com')
        
        service = build('gmail', 'v1', credentials=delegated_credentials)
        
        import base64
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        message = MIMEMultipart('alternative')
        message['to'] = to
        message['subject'] = subject
        
        html_part = MIMEText(body, 'html')
        message.attach(html_part)
        
        raw_message = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
        
        sent_message = service.users().messages().send(userId='me', body=raw_message).execute()
        
        return {
            'success': True,
            'message_id': sent_message['id']
        }
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# Fonction pour traiter les messages de la file d'attente d'emails
def process_email_queue():
    try:
        connection = get_rabbitmq_connection()
        channel = connection.channel()
        
        def callback(ch, method, properties, body):
            try:
                data = json.loads(body)
                logger.info(f"Traitement d'un message email: {data}")
                
                # Vérifier les données requises
                if 'to' not in data or 'template' not in data or 'data' not in data:
                    logger.error("Données manquantes dans le message")
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    return
                
                template_name = data['template']
                template_data = data['data']
                
                # Sélectionner le template
                if template_name == 'booking_confirmation':
                    template = EmailTemplate.BOOKING_CONFIRMATION
                elif template_name == 'payment_confirmation':
                    template = EmailTemplate.PAYMENT_CONFIRMATION
                elif template_name == 'appointment_reminder':
                    template = EmailTemplate.APPOINTMENT_REMINDER
                else:
                    logger.error(f"Template inconnu: {template_name}")
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    return
                
                # Formatter le template
                subject = template['subject']
                body = template['body'].format(**template_data)
                
                # Envoyer l'email
                result = send_gmail(data['to'], subject, body)
                
                if result['success']:
                    logger.info(f"Email envoyé avec succès: {result['message_id']}")
                else:
                    logger.error(f"Échec de l'envoi de l'email: {result['error']}")
                
                ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                logger.error(f"Erreur lors du traitement du message: {str(e)}")
                ch.basic_ack(delivery_tag=method.delivery_tag)
        
        channel.basic_consume(queue='email_notifications', on_message_callback=callback)
        
        logger.info('En attente de messages email...')
        channel.start_consuming()
    except Exception as e:
        logger.error(f"Erreur dans le worker d'emails: {str(e)}")
        time.sleep(5)  # Attendre avant de réessayer
        process_email_queue()

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/api/notify/email', methods=['POST'])
def send_email_notification():
    try:
        data = request.json
        
        # Validation des données
        if 'to' not in data or 'template' not in data or 'data' not in data:
            return jsonify({'error': 'Données manquantes'}), 400
        
        # Publier le message dans la file d'attente
        connection = get_rabbitmq_connection()
        channel = connection.channel()
        
        channel.basic_publish(
            exchange='',
            routing_key='email_notifications',
            body=json.dumps(data),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Rendre le message persistant
            )
        )
        
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Notification ajoutée à la file d\'attente',
            'notification_id': f"email_{int(datetime.now().timestamp())}"
        })
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de la notification: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/notify/reminder', methods=['POST'])
def schedule_reminder():
    try:
        data = request.json
        
        # Validation des données
        if 'to' not in data or 'template' not in data or 'data' not in data or 'schedule_time' not in data:
            return jsonify({'error': 'Données manquantes'}), 400
        
        # Dans une implémentation réelle, ce rappel serait programmé avec un scheduler
        # Pour cette démonstration, nous renvoyons simplement un ID de notification
        
        return jsonify({
            'success': True,
            'message': 'Rappel programmé',
            'notification_id': f"reminder_{int(datetime.now().timestamp())}"
        })
    except Exception as e:
        logger.error(f"Erreur lors de la programmation du rappel: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/notify/status/<notification_id>', methods=['GET'])
def get_notification_status(notification_id):
    # Dans une implémentation réelle, nous vérifierions le statut dans une base de données
    # Pour cette démonstration, nous renvoyons un statut fictif
    
    return jsonify({
        'notification_id': notification_id,
        'status': 'delivered',
        'delivered_at': datetime.now().isoformat()
    })

# Démarrer le worker de traitement des emails dans un thread séparé
def start_workers():
    email_worker = threading.Thread(target=process_email_queue)
    email_worker.daemon = True
    email_worker.start()

# Point d'entrée principal
if __name__ == '__main__':
    # Configurer RabbitMQ
    setup_rabbitmq()
    
    # Démarrer les workers
    start_workers()
    
    # Démarrer l'application Flask
    app.run(host='0.0.0.0', port=5000)
