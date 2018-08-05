const router = require('express').Router();
const passport = require('passport');
const MatchDay = require('../models/matchday-model');

router.get('/schedule', (req, res) => {

  console.log("Inside Schedule");

  // if(!req.session.user){
  //   res.status(401).send();
  // }

MatchDay.aggregate(
  [
        {"$project": {
          "matches": 1
        }
    },
    { "$unwind": "$matches" }

  ], function(err, result){
    if(err){
      res.status(500).send();
    }
    for(let match of result){
      let date = calcTime(match.matches.date, match.matches.timezone, match.matches.time);
      let month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      match.matches.date = dateToFormat(date);
      match.matches.year = date.getFullYear();
      match.matches.day = date.getDate();
      match.matches.month = month[date.getMonth()];
      match.matches.hours = date.getHours();
      match.matches.minutes = date.getMinutes();
    }
      res.status(200).json(result);
  });


});

// convert time to IST from UTC
function calcTime(date, timezone, time) {

    let d = new Date(date);

    var timeArray = time.split(":");
    d.setHours(timeArray[0]);
    d.setMinutes(timeArray[1]);

    let conTimeZoneArray = timezone.replace("UTC","").split(":");

    //conversion to IST
    if(conTimeZoneArray){
      if(conTimeZoneArray.length > 0){
        d.setHours(d.getHours() + (5-parseInt(conTimeZoneArray[0])));
      }else d.setHours(d.getHours() + 5);

      if(conTimeZoneArray.length > 1){
        d.setMinutes(d.getMinutes() + (30 - parseInt(conTimeZoneArray[1])));
      }else d.setMinutes(d.getMinutes() + 30);
    }
    return d;
}

function dateToFormat(date){
  let formatedDate = date;
  let dd = formatedDate.getDate();

  let mm = formatedDate.getMonth()+1;
  const yyyy = formatedDate.getFullYear();
  if(dd<10)
  {
      dd=`0${dd}`;
  }

  if(mm<10)
  {
      mm=`0${mm}`;
  }
  formatedDate = `${yyyy}-${mm}-${dd}`;
  return formatedDate;
}

module.exports = router;
