import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { FcmService } from '../app/fcm.service';

import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';

import { Darshan } from './models/darshan';
import { Audio } from './models/audio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    public fcm: FcmService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Get a FCM token
      this.fcm.getToken();

      // Listen to incoming messages
      this.fcm
        .listenToNotifications()
        .pipe(
          tap(async msg => {
            this.router.navigateByUrl(msg.page);

            if (this.platform.is('ios')) {
              // show a toast
            // const toast = await this.toastCtrl.create({
            //   message: msg.aps.alert.body,
            //   duration: 3000
            // });
            // toast.present();
            }

          })
        )
        .subscribe();
      this.setupData();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private setupData() {
    this.storage.get('dataExists').then(data => {
      if (data) {
      } else {
        this.storage.set('dataExists', true);
        this.storage.set('isDarshanUpdated', false);
        this.storage.set('date', '');
        this.storage.set('darshan', new Array<Darshan>());
        this.storage.set('audios', new Array<Audio>());
      }
    });
  }
}
