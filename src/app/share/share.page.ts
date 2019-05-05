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
      this.db.object('/share/ios-share').valueChanges().subscribe((value: string) => {
        this.shareUrl = value;
      });
    }
    if (this.platform.is('android')) {
      this.db.object('/share/android-share').valueChanges().subscribe((value: string) => {
        this.shareUrl = value;
      });
    }
  }

  shareApp() {
    if (this.shareUrl) {
      this.socialSharing
        .share(
          `Shri Madhusudan Bapuji\n${this.shareUrl}`,
          null,
          null,
          null
        )
        .then(() => { })
        .catch(() => { });
    }

  }
}
