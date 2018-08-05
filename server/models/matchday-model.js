const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchdaySchema = new Schema({
  name: String,
      matches: [
        {
          num: Number,
          date: String,
          time: String,
          team1: {
            name: String,
            code: String
          },
          team2: {
            name: String,
            code: String
          },
          score1: Number,
          score2: Number,
          knockout: Boolean,
          stadium: {
            key: String,
            name: String
          },
          city: String,
          timezone: String
        }
      ]
});

const MatchDay = mongoose.model('matchdays', matchdaySchema);

module.exports = MatchDay;
