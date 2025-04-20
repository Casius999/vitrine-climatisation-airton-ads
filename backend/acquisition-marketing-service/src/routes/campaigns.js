const express = require('express');
const { createCampaign, getCampaigns, getCampaignById, updateCampaign, changeCampaignStatus, executeCampaign, getCampaignPerformance } = require('../controllers/campaignController');

const router = express.Router();

/**
 * @route   POST /api/campaigns
 * @desc    Crée une nouvelle campagne marketing
 * @access  Private
 */
router.post('/', createCampaign);

/**
 * @route   GET /api/campaigns
 * @desc    Récupère toutes les campagnes avec filtrage
 * @access  Private
 */
router.get('/', getCampaigns);

/**
 * @route   GET /api/campaigns/:id
 * @desc    Récupère une campagne par son ID
 * @access  Private
 */
router.get('/:id', getCampaignById);

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Met à jour une campagne existante
 * @access  Private
 */
router.put('/:id', updateCampaign);

/**
 * @route   PATCH /api/campaigns/:id/status
 * @desc    Change le statut d'une campagne
 * @access  Private
 */
router.patch('/:id/status', changeCampaignStatus);

/**
 * @route   POST /api/campaigns/:id/execute
 * @desc    Exécute une campagne email
 * @access  Private
 */
router.post('/:id/execute', executeCampaign);

/**
 * @route   GET /api/campaigns/:id/performance
 * @desc    Récupère les performances d'une campagne
 * @access  Private
 */
router.get('/:id/performance', getCampaignPerformance);

module.exports = router;
