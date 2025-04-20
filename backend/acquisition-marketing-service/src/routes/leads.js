const express = require('express');
const { createLead, getLeads, getLeadById, updateLead, addLeadNote, assignTags, changeLeadStatus } = require('../controllers/leadController');

const router = express.Router();

/**
 * @route   POST /api/leads
 * @desc    Crée un nouveau lead
 * @access  Public
 */
router.post('/', createLead);

/**
 * @route   GET /api/leads
 * @desc    Récupère tous les leads avec filtrage et pagination
 * @access  Private
 */
router.get('/', getLeads);

/**
 * @route   GET /api/leads/:id
 * @desc    Récupère un lead par son ID
 * @access  Private
 */
router.get('/:id', getLeadById);

/**
 * @route   PUT /api/leads/:id
 * @desc    Met à jour un lead existant
 * @access  Private
 */
router.put('/:id', updateLead);

/**
 * @route   POST /api/leads/:id/notes
 * @desc    Ajoute une note à un lead
 * @access  Private
 */
router.post('/:id/notes', addLeadNote);

/**
 * @route   POST /api/leads/:id/tags
 * @desc    Assigne des tags à un lead
 * @access  Private
 */
router.post('/:id/tags', assignTags);

/**
 * @route   PATCH /api/leads/:id/status
 * @desc    Change le statut d'un lead
 * @access  Private
 */
router.patch('/:id/status', changeLeadStatus);

module.exports = router;
