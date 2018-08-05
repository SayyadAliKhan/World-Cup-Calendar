import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  responseData : any;
  createSuccess = false;
  registerCredentials = { name: '', email: '', password: '', confirmation_password: '' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthServiceProvider,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  public register() {
   if (this.registerCredentials.password != this.registerCredentials.confirmation_password) {
     this.showPopup("Error", 'The password confirmation does not match.');
   } else {
     this.auth.register(this.registerCredentials, 'auth/register').subscribe(result => {

      this.responseData = result;
      if(this.responseData.userData){
        console.log(this.responseData);
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
        localStorage.setItem('userData', JSON.stringify(this.responseData.userData));
      }
      else{
        console.log("User already exists");
        this.showPopup("Error", "User already exists");
      }
     },
       error => {
         this.showPopup("Error", error);
       });
   }
 }

 showPopup(title, text) {
   let alert = this.alertCtrl.create({
     title: title,
     subTitle: text,
     buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             this.navCtrl.push(HomePage);
           }
         }
       }
     ]
   });
   alert.present();
 }

 login(){
    //Login page link
    this.navCtrl.push(LoginPage);
  }

public googleService(){

}

}
