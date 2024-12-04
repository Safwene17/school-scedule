const bcrypt = require('bcrypt');
const Etudiant = require('../model/Etudiant');
const Classe = require('../model/Classe');

// Create a new Etudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { nom, email, mdp, classeId } = req.body;

    // Validate required fields
    if (!nom || !email || !mdp || !classeId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if Classe exists
    const classe = await Classe.findById(classeId);
    if (!classe) {
      return res.status(400).json({ message: 'Classe not found' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(mdp, 10);

    const etudiant = new Etudiant({
      nom,
      email,
      mdp: hashedPassword,
      classe: classeId,
    });

    await etudiant.save();
    res.status(201).json({ message: 'Etudiant created successfully', etudiant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all Etudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find().populate('classe');
    res.status(200).json(etudiants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login an Etudiant
exports.loginEtudiant = async (req, res) => {
  try {
    const { email, mdp } = req.body;

    // Validate input
    if (!email || !mdp) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find the Etudiant by email
    const etudiant = await Etudiant.findOne({ email });
    if (!etudiant) {
      return res.status(400).json({ message: 'Invalid email .' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(mdp, etudiant.mdp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful',
      etudiant: {
        id: etudiant._id,
        nom: etudiant.nom,
        email: etudiant.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Get an Etudiant by ID
exports.getEtudiantById = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id).populate('classe');
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant not found' });
    }
    res.status(200).json(etudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an Etudiant
exports.updateEtudiant = async (req, res) => {
  try {
    const { nom, email, mdp, classeId } = req.body;

    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant not found' });
    }

    const classe = await Classe.findById(classeId);
    if (!classe) {
      return res.status(400).json({ message: 'Classe not found' });
    }

    etudiant.nom = nom || etudiant.nom;
    etudiant.email = email || etudiant.email;
    etudiant.mdp = mdp || etudiant.mdp;
    etudiant.classe = classeId || etudiant.classe;

    await etudiant.save();
    res.status(200).json(etudiant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an Etudiant
exports.deleteEtudiant = async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant not found' });
    }
    res.status(200).json({ message: 'Etudiant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};