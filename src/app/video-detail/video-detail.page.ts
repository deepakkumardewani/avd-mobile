import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  @Input() videoData: any;
  constructor(
    public modalController: ModalController,
    public sanitizer: DomSanitizer,
    private socialSharing: SocialSharing
    ) { }

  ngOnInit() {

  }

  close() {
    this.modalController.dismiss();
  }

  videoURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoData.videoUrl);
  }


  shareImage() {
    this.socialSharing
      .share(
        `https://youtu.be/${this.videoData.id}`,
        '',
        '',
        ''
      )
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
  }

}
