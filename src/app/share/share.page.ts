import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  shareObject: Observable<any>;
  shareUrl: string;
  constructor(
    private socialSharing: SocialSharing,
    private db: AngularFireDatabase,
    private platform: Platform
  ) { }

  ngOnInit() {
    if (this.platform.is('ios')) {
      this.shareUrl = 'https://itunes.apple.com/in/app/shri-madhusudan-bapuji/id1252673961?ls=1&mt=8';
    }
    if (this.platform.is('android')) {
      this.shareUrl = 'https://play.google.com/store/apps/details?id=com.krishna.app&hl=en';
    }
  }

  shareApp() {
    if (this.shareUrl) {
      this.socialSharing
        .share(
          `Shri Madhusudan Bapuji\n\n${this.shareUrl}`,
          null,
          null,
          null
        )
        .then(() => { })
        .catch(() => { });
    }

  }
}
