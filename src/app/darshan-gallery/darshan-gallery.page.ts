import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';


declare var cordova: any;

@Component({
  selector: 'app-darshan-gallery',
  templateUrl: './darshan-gallery.page.html',
  styleUrls: ['./darshan-gallery.page.scss'],
})
export class DarshanGalleryPage implements OnInit {

  @ViewChild('slides') slides: any;
  @Input() images: any;
  @Input() index: number;

  slideOpts = {
    effect: 'fade',
    spaceBetween: 5,
    pagination: false,
    scrollbar: {
      draggable: false,
    }
  };


  constructor(
    public modalController: ModalController,
    private socialSharing: SocialSharing,
    private webview: WebView
    ) { }

  ngOnInit() {
    this.slides.slideTo(this.index, 0);
  }

  close() {
    this.modalController.dismiss();
  }

  async shareImage() {
    const activeIndex = await this.slides.getActiveIndex();
    this.socialSharing
      .share(
        '',
        '',
        this.normalizeURL(this.images[activeIndex].title),
        ''
      )
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.error('error');
      });
  }

  normalizeURL(title) {
    const url = `${cordova.file.dataDirectory}images/${title}`;
    return this.webview.convertFileSrc(url);
  }

}
