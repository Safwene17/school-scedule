const Classe = require('../model/Classe');

// Ajouter une nouvelle classe
exports.createClasse = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le champ nom est obligatoire.' });
    const newClasse = new Classe({ nom });
    const savedClasse = await newClasse.save();
    res.status(201).json(savedClasse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les classes
exports.getAllClasses = async (req, res) => {
    try {
      const classes = await Classe.find();
      res.status(200).json(classes.map((classe) => ({
        name: classe.nom, 
        _id: classe._id,

      })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  

// Récupérer une classe par ID
exports.getClasseById = async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.id);
    if (!classe) return res.status(404).json({ message: 'Classe non trouvée' });
    res.status(200).json(classe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une classe
exports.updateClasse = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le champ nom est obligatoire.' });
    const updatedClasse = await Classe.findByIdAndUpdate(
      req.params.id,
      { nom },
      { new: true }
    );
    if (!updatedClasse) return res.status(404).json({ message: 'Classe non trouvée' });
    res.status(200).json(updatedClasse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une classe
exports.deleteClasse = async (req, res) => {
  try {
    const deletedClasse = await Classe.findByIdAndDelete(req.params.id);
    if (!deletedClasse) return res.status(404).json({ message: 'Classe non trouvée' });
    res.status(200).json({ message: 'Classe supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
