import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {


  static readonly API_URL = 'http://localhost:3000/';

  token: string;
  responseData: any;

  constructor(public http: HttpClient) {}

  // Login
  public login(credentials, type) {
    if (credentials.name === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return Observable.create(observer => {

        console.log(AuthServiceProvider.API_URL + type, JSON.stringify(credentials));
        this.http.post(AuthServiceProvider.API_URL + type, credentials)
        .subscribe( data => {
          this.responseData = data;
          console.log(data)
          // if (data) {
          //  this.token = 'Bearer ' + this.responseData.user.id;
          // }
        },
         error => {
           console.log("error and access false" + JSON.stringify(error));
           this.responseData = error.error;
         });

        setTimeout(() => {
              observer.next(this.responseData);
          }, 500);

        setTimeout(() => {
              observer.complete();
          }, 1000);


      }, err => console.error(err));
    }
  }

  // Register
  public register(credentials, type) {
    if (credentials.name === null || credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials.");
    } else {
      return Observable.create(observer => {

        this.http.post(AuthServiceProvider.API_URL + type, credentials)
        .subscribe( data => {
          this.responseData = data;

        }, err => {
          console.error(err);
          this.responseData = err.error;
        });

        setTimeout(() => {
              observer.next(this.responseData);
          }, 500);

        setTimeout(() => {
              observer.complete();
          }, 1000);

      });
    }
  }

  // Register
  public loggingout(type) {

      return Observable.create(observer => {

        this.http.get(AuthServiceProvider.API_URL + type)
        .subscribe( data => {

        }, err => {
          console.error(err);
          this.responseData = err.error;
        });
        observer.next();

        setTimeout(() => {
              observer.complete();
          }, 500);

      });
    }

  // Get Schedule
  public getMatches(type) {

      return Observable.create(observer => {

        this.http.get(AuthServiceProvider.API_URL + type)
        .subscribe( data => {
          this.responseData = data;
          console.log(data);
        }, err => console.error(err));

       setTimeout(() => {
            console.log("In Observer get matches");
              observer.next(this.responseData);
          }, 900);

        setTimeout(() => {
              observer.complete();
          }, 1000);

      });
    }

  // Get Token
  // public getToken() {
  //   return this.token;
  // }

  // Logout
  // public logout() {
  //   return Observable.create(observer => {
  //     observer.next(true);
  //     observer.complete();
  //   });
  // }


}
