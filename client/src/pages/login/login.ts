import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: Loading;
  registerCredentials = { name: '', password: '' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthServiceProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public createAccount() {
    this.navCtrl.push(SignupPage);
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials, 'auth/login').subscribe(res => {
     if (res.access) {
       localStorage.setItem('userData', JSON.stringify(res.userData));
       this.navCtrl.setRoot(HomePage);
     } else {
       console.log("success and access false");
       this.showError(res.mesg);
     }
    },
     error => {
       console.log("error and access false");
       this.showError(error);
     });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
