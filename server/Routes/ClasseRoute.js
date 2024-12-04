const express = require('express');
const ClasseController = require('../Controller/ClasseController');

const router = express.Router();

// Routes pour les classes
router.post('/create', ClasseController.createClasse);

//get all
router.get('/all', ClasseController.getAllClasses);
router.get('/:id', ClasseController.getClasseById);
router.put('/:id', ClasseController.updateClasse);
router.delete('/:id', ClasseController.deleteClasse);

module.exports = router;
