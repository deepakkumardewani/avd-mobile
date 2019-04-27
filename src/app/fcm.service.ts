import { Platform } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Device } from '@ionic-native/device/ngx';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private device: Device
  ) { }

    // Get permission from the user
    async getToken() {
      let token;

      if (this.platform.is('android')) {
        token = await this.firebaseNative.getToken();
      }

      if (this.platform.is('ios')) {
        token = await this.firebaseNative.getToken();
        await this.firebaseNative.grantPermission();
      }

      return this.saveTokenToFirestore(token);
    }

    // Save the token to firestore
    private saveTokenToFirestore(token) {
      if (!token) { return; }

      const devicesRef = this.afs.collection('devices');

      const userId = `${this.device.model}-${this.device.uuid}`;
      const docData = {
        token,
        userId,
      };

      return devicesRef.doc(token).set(docData);
    }

    // Listen to incoming FCM messages
    listenToNotifications() {
      return this.firebaseNative.onNotificationOpen();
    }
}
