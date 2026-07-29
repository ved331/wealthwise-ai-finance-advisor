const express = require('express');
const router = express.Router();
const { chatWithAI, getSuggestions } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');

router.post('/chat', optionalProtect, chatWithAI);
router.post('/suggestions', optionalProtect, getSuggestions);
router.get('/suggestions', optionalProtect, getSuggestions);

module.exports = router;

