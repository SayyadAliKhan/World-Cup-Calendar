import { Component, EventEmitter } from "@angular/core";
import { NavController, App } from "ionic-angular";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  matchdays: any;
  matches: any;
  userDetails: any;
  responseData: any;
  userPostData = { user_id: "", token: "" };

  constructor(
    private auth: AuthServiceProvider,
    public http: HttpClient,
    public app: App
  ) {
    const data = JSON.parse(localStorage.getItem("userData"));
    console.log("Inside Home", data);
    this.userDetails = data;

    this.userPostData.user_id = this.userDetails.username;
    this.userPostData.token = this.userDetails.id;
    this.getMatches();
  }

  public getMatches() {
    console.log("Inside Matches");
    this.auth.getMatches("api/schedule").subscribe(data => {
      let matchesArray = data;
      let length = matchesArray.length;
      let tempDate = "";

      let a = [];
      let count = 0;
      let todaysDate = new Date();
      let isTodayInd = false;
      for (let index of matchesArray) {
        let matchData = { fulldate: "", date: "", month: "", year: "", matchday: [{}] };
        let date = index.matches.date;

        if (tempDate != date) {
          tempDate = date;
          matchData.fulldate = date;
          matchData.date = index.matches.day;
          matchData.month = index.matches.month;
          matchData.year = index.matches.year;

          a.unshift(matchData);
          if (this.isToday(matchData, todaysDate)) {
            this.matches = a[0].matchday;
            isTodayInd = true;
          }
          count = 0;
        } else {
          count++;
          a[0].matchday.push({});
        }

        a[0].matchday[count].team1 = index.matches.team1;
        a[0].matchday[count].team2 = index.matches.team2;
        a[0].matchday[count].score1 = index.matches.score1;
        a[0].matchday[count].score2 = index.matches.score2;
        a[0].matchday[count].group = index.matches.group;
        a[0].matchday[count].stadium = index.matches.stadium;
        a[0].matchday[count].hours = index.matches.hours;
        a[0].matchday[count].minutes = index.matches.minutes;
        a[0].matchday[count].matchno = count;
        a[0].matchday[count].isLive = false;
        if (this.isToday(a[0], todaysDate) && this.isLive(date, a[0].matchday[count])) {
          a[0].matchday[count].isLive = true;
        }
      }
      a.reverse();
      if(!isTodayInd){
          if(todaysDate.getTime() < new Date(a[0].matchday[0].fulldate).getTime()){  //viewing the calendar before the tournament has started
              this.matches = a[0].matchday;
            }else{
              this.matches = a[a.length - 1].matchday;
            }
      }
      this.matchdays = a;
      setTimeout(this.loadScript(), 2000);
    });
  }

  public matchdata(matches) {
    console.log(matches);
    this.matches = matches.matchday;
  }

  public logout() {
    this.auth.loggingout("auth/logout").subscribe(data => {
      localStorage.clear();
      setTimeout(() => this.backToWelcome(), 1000);
    });
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.setRoot(LoginPage);
  }

  isToday(matchData, todaysDate) {
    return (
      parseInt(matchData.year) === todaysDate.getFullYear() &&
      parseInt(matchData.month) == todaysDate.getMonth() &&
      parseInt(matchData.date) == todaysDate.getDay()
    );
  }

// Adding hours and Time can be changed if the status of match is available
// Assuming the match to be of 90 minutes only
isLive(matchDate, compDate){
  let calculatedDate = new Date();
  calculatedDate.setHours(calculatedDate.getHours() + 1);
  calculatedDate.setMinutes(calculatedDate.getMinutes() + 30);
  let cloneMatchDate = JSON.parse(JSON.stringify(matchDate));
  cloneMatchDate.setHours(compDate.getHours);
  cloneMatchDate.setMinutes(compDate.getMinutes());
  return calculatedDate.getTime() <= new Date().getTime() && new Date().getTime() > cloneMatchDate.getTime();
}

  public loadScript() {
    document.onload = function() {
      var sliderImages = document.querySelectorAll(".slider");
      console.log(sliderImages);
      console.log(sliderImages.item(0));
      let current = 0;

      // Clear all images
      function reset() {
        for (let i = 0; i < sliderImages.length; i++) {
          // sliderImages.item(i).style.display = "none";
        }
      }

      // Init slider
      function startSlide() {
        reset();
        //sliderImages[0].style.display = "block";
      }

      // Show prev
      function slideLeft() {
        reset();
        //sliderImages[current - 1].style.display = "block";
        current--;
      }

      // Show next
      function slideRight() {
        console.log("slide right called");
        reset();
        //  sliderImages[current + 1].style.display = "block";
        current++;
      }

      // Left arrow click
      var el = document.querySelector("#arrow-left");
      if (el) {
        el.addEventListener("click", function() {
          if (current === 0) {
            current = sliderImages.length;
          }
          slideLeft();
        });
      }

      // Right arrow click
      var er = document.querySelector("#arrow-right");
      if (er) {
        er.addEventListener("click", function() {
          if (current === sliderImages.length - 1) {
            current = -1;
          }
          slideRight();
        });
      }

      startSlide();
    };
  }
}
