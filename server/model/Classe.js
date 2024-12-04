const mongoose = require('mongoose');

const ClasseSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Classe', ClasseSchema);
