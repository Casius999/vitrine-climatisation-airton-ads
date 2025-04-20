const express = require('express');
const { startChatSession, processUserMessage, saveConversation, getConversationHistory } = require('../controllers/chatbotController');

const router = express.Router();

/**
 * @route   POST /api/chatbot/session
 * @desc    Démarre une nouvelle session de chatbot
 * @access  Public
 */
router.post('/session', startChatSession);

/**
 * @route   POST /api/chatbot/message
 * @desc    Traite un message utilisateur et génère une réponse
 * @access  Public
 */
router.post('/message', processUserMessage);

/**
 * @route   POST /api/chatbot/conversation
 * @desc    Enregistre une conversation complète avec un lead identifié
 * @access  Private
 */
router.post('/conversation', saveConversation);

/**
 * @route   GET /api/chatbot/conversation/:leadId
 * @desc    Récupère l'historique des conversations pour un lead
 * @access  Private
 */
router.get('/conversation/:leadId', getConversationHistory);

module.exports = router;
