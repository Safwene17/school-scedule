// routes/etudiantRoutes.js

const express = require('express');
const router = express.Router();
const etudiantController = require('../Controller/etudiantController');

// Create a new Etudiant
router.post('/create', etudiantController.createEtudiant);

router.post('/login', etudiantController.loginEtudiant);


// Get all Etudiants
router.get('/', etudiantController.getAllEtudiants);

// Get Etudiant by ID
router.get('/:id', etudiantController.getEtudiantById);

// Update Etudiant by ID
router.put('/:id', etudiantController.updateEtudiant);

// Delete Etudiant by ID
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;