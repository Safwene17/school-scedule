const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  className: { type: String, required: true }, // Utilisation de String au lieu de ObjectId
  days: { type: [String], required: true }, // Tableau de jours
  times: { type: [String], required: true }, // Tableau d'horaires
  subjects: { type: [[String]], required: true }, // Tableau 2D pour les matières
}, {
  timestamps: true,
});

module.exports = mongoose.model('Timetable', timetableSchema);
