import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { FcmService } from '../app/fcm.service';

import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Darshan } from './models/darshan';
import { Audio } from './models/audio';

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
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Get a FCM token
      this.fcm.getToken();

      this.fcm.listenToNotifications().subscribe(async msg => {
        const toast = await this.toastCtrl.create({
          message: msg.body,
          duration: 10000
        });
        toast.present();
      });
      // Listen to incoming messages
      this.fcm
        .listenToNotifications()
        .pipe(
          tap(async msg => {
            // show a toast
            const toast = await this.toastCtrl.create({
              message: msg.body,
              duration: 10000
            });
            toast.present();
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
