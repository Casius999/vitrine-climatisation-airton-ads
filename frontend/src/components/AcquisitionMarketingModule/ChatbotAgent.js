import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar, CircularProgress, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useMarketingContext } from '../../contexts/MarketingContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Composant de chatbot intelligent pour l'acquisition de prospects
 * Engage la conversation avec les visiteurs et collecte des informations
 */
const ChatbotAgent = () => {
  const { updateLead, setIsLeadCaptured } = useMarketingContext();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialisation du chatbot au chargement du composant
  useEffect(() => {
    // Génération d'un identifiant unique pour le visiteur (persistant)
    const storedVisitorId = localStorage.getItem('visitorId');
    const newVisitorId = storedVisitorId || uuidv4();
    if (!storedVisitorId) {
      localStorage.setItem('visitorId', newVisitorId);
    }
    setVisitorId(newVisitorId);

    // Initialisation de la session
    startChatSession(newVisitorId);

    // Nettoyage à la fermeture
    return () => {
      // Sauvegarde éventuelle de la conversation
      if (sessionId && messages.length > 0) {
        saveChatSession();
      }
    };
  }, []);

  // Défilement automatique vers le bas à chaque nouveau message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Démarrer une nouvelle session de chat
  const startChatSession = async (visitorId) => {
    try {
      setIsTyping(true);
      const response = await axios.post(`${API_URL}/api/chatbot/session`, { visitorId });
      
      if (response.data.success) {
        const { sessionId, message } = response.data.data;
        setSessionId(sessionId);
        
        // Ajouter le message de bienvenue
        setMessages([{
          id: uuidv4(),
          sender: 'bot',
          content: message.message,
          timestamp: new Date(),
        }]);
        
        // Définir les options de réponse rapide si disponibles
        if (message.options && message.options.length > 0) {
          setQuickReplies(message.options);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du chatbot:', error);
      // Message d'erreur par défaut
      setMessages([{
        id: uuidv4(),
        sender: 'bot',
        content: "Désolé, je rencontre des difficultés techniques. Vous pouvez utiliser le formulaire ci-dessous ou nous appeler directement.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Envoyer un message au chatbot
  const sendMessage = async (messageContent) => {
    if (!sessionId || (!messageContent.trim() && messageContent !== '')) return;
    
    // Afficher immédiatement le message de l'utilisateur
    const userMessage = {
      id: uuidv4(),
      sender: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setCurrentMessage('');
    setQuickReplies([]);
    setIsTyping(true);
    
    try {
      // Récupérer des informations supplémentaires sur le visiteur
      const visitorData = {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        // Récupérer les paramètres UTM de l'URL si présents
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        utmContent: new URLSearchParams(window.location.search).get('utm_content'),
      };
      
      // Envoyer le message au backend
      const response = await axios.post(`${API_URL}/api/chatbot/message`, {
        sessionId,
        message: messageContent,
        visitorData,
      });
      
      if (response.data.success) {
        const botData = response.data.data;
        
        // Ajouter la réponse du bot
        const botMessage = {
          id: uuidv4(),
          sender: 'bot',
          content: botData.message,
          timestamp: new Date(),
          action: botData.action || null,
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
        
        // Mettre à jour les options de réponse rapide
        if (botData.options && botData.options.length > 0) {
          setQuickReplies(botData.options);
        } else {
          setQuickReplies([]);
        }
        
        // Si des données de lead ont été collectées, les transmettre au contexte
        if (botData.leadData) {
          updateLead(botData.leadData);
          setIsLeadCaptured(true);
        }
        
        // Gérer les actions spéciales
        if (botData.action === 'complete') {
          // La conversation est terminée, sauvegarder
          saveChatSession();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Message d'erreur par défaut
      setMessages(prevMessages => [...prevMessages, {
        id: uuidv4(),
        sender: 'bot',
        content: "Désolé, je rencontre des difficultés techniques. Vous pouvez utiliser le formulaire ci-dessous ou nous appeler directement.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Envoyer le message en cours de saisie
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
    }
  };

  // Gérer l'envoi par touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sélectionner une réponse rapide
  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  // Sauvegarder la session de chat
  const saveChatSession = async () => {
    // Cette fonction serait appelée pour sauvegarder l'historique complet
    // Si un lead a été identifié, on pourrait lier la conversation à son profil
    try {
      // Code pour sauvegarder la session si nécessaire
      // await axios.post(`${API_URL}/api/chatbot/conversation`, { ... });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
    }
  };

  // Défiler automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#0066cc', mr: 1 }}>
          <SmartToyIcon />
        </Avatar>
        <Typography variant="h6">Assistant Airton</Typography>
      </Box>
      
      {/* Zone de messages */}
      <Box sx={{ height: 320, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
        {messages.map((msg) => (
          <Box 
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {msg.sender === 'bot' && (
              <Avatar sx={{ bgcolor: '#0066cc', width: 32, height: 32, mr: 1 }}>
                <SmartToyIcon sx={{ fontSize: 18 }} />
              </Avatar>
            )}
            
            <Paper 
              sx={{
                p: 1.5,
                maxWidth: '70%',
                borderRadius: 2,
                bgcolor: msg.sender === 'user' ? '#e1f5fe' : 'white',
                ml: msg.sender === 'user' ? 1 : 0,
                mr: msg.sender === 'bot' ? 1 : 0,
              }}
            >
              <Typography variant="body2">{msg.content}</Typography>
            </Paper>
            
            {msg.sender === 'user' && (
              <Avatar sx={{ bgcolor: '#4caf50', width: 32, height: 32, ml: 1 }}>
                <PersonIcon sx={{ fontSize: 18 }} />
              </Avatar>
            )}
          </Box>
        ))}
        
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Avatar sx={{ bgcolor: '#0066cc', width: 32, height: 32, mr: 1 }}>
              <SmartToyIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <CircularProgress size={24} thickness={5} />
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Zone de réponses rapides */}
      {quickReplies.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {quickReplies.map((reply, index) => (
            <Chip 
              key={index}
              label={reply}
              variant="outlined"
              onClick={() => handleQuickReply(reply)}
              clickable
              sx={{ 
                borderColor: '#0066cc',
                color: '#0066cc',
                '&:hover': { bgcolor: '#e1f5fe' } 
              }}
            />
          ))}
        </Box>
      )}
      
      {/* Zone de saisie */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tapez votre message ici..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!currentMessage.trim() || isTyping}
          sx={{ ml: 1, height: 40 }}
        >
          Envoyer
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatbotAgent;
