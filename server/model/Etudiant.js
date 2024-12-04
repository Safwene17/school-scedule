// models/Etudiant.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Classe = require('./Classe');  // Adjust the path if necessary

const etudiantSchema = new Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  mdp: {
    type: String,
    required: true,
  },
  classe: {
    type: Schema.Types.ObjectId,
    ref: 'Classe',
    required: true,
  },
}, { timestamps: true });

const Etudiant = mongoose.model('Etudiant', etudiantSchema);

module.exports = Etudiant;