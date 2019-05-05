import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';


import { VideoDetailPageModule } from './video-detail/video-detail.module';
import { DarshanGalleryPageModule } from './darshan-gallery/darshan-gallery.module';
import { AudioDetailPageModule } from './audio-detail/audio-detail.module';
import { AudioDetailPage } from './audio-detail/audio-detail.page';

import { HelperService } from './helper.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FcmService } from '../app/fcm.service';


const firebase = {
  apiKey: 'AIzaSyC_lFughRywTX7uuhsTWkQMACXp7VsZkxk',
  authDomain: 'anand-vrindavan-dham.firebaseapp.com',
  databaseURL: 'https://anand-vrindavan-dham.firebaseio.com',
  projectId: 'anand-vrindavan-dham',
  storageBucket: 'anand-vrindavan-dham.appspot.com',
  messagingSenderId: '495744037404'
};

@NgModule({
  declarations: [ AppComponent ],
  entryComponents: [AudioDetailPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AudioDetailPageModule,
    DarshanGalleryPageModule,
    VideoDetailPageModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HelperService,
    Media,
    File,
    Device,
    FileTransfer,
    SafariViewController,
    InAppBrowser,
    EmailComposer,
    WebView,
    SocialSharing,
    Firebase,
    FcmService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
