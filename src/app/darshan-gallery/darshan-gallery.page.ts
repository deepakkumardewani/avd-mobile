import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

import { Darshan } from '../models/darshan';
declare var cordova: any;

@Component({
  selector: 'app-darshan-gallery',
  templateUrl: './darshan-gallery.page.html',
  styleUrls: ['./darshan-gallery.page.scss'],
})
export class DarshanGalleryPage implements OnInit, OnDestroy {

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

  // watch network for a disconnection
  disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    setTimeout(() => {
      console.log('network was disconnected :-(');
      for (let i = 0; i < this.images.length; i++) {
        this.images[i].isError = true;
      }
    }, 3000);
  });

  constructor(
    public modalController: ModalController,
    private socialSharing: SocialSharing,
    private webview: WebView,
    private platform: Platform,
    private network: Network,
    public alertController: AlertController,
    public toastController: ToastController,
    private transfer: FileTransfer,
    private file: File
  ) { }

  ngOnDestroy(): void {
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }
  ngOnInit() {
    this.slides.slideTo(this.index, 0);
  }

  close() {
    this.modalController.dismiss();
  }

  async shareImage() {
    const activeIndex = await this.slides.getActiveIndex();
    let url;
    if (this.platform.is('android')) {
      url = `${cordova.file.dataDirectory}images/${this.images[activeIndex].fileName}`;
    }
    if (this.platform.is('ios')) {
      url = `${cordova.file.dataDirectory.replace(/^file:\/\//, '')}images/${this.images[activeIndex].fileName}`;
    }
    this.socialSharing
      .share(
        '',
        '',
        url,
        ''
      )
      .then((result) => {
        console.log(`success:${result}`);
      })
      .catch((err) => {
        console.error(`error:${err}`);
      });
  }

  normalizeURL(title) {
    const url = `${cordova.file.dataDirectory}images/${title}`;
    // console.log(url);
    // console.log(this.webview.convertFileSrc(url));
    // return url;

    return this.webview.convertFileSrc(url);
  }

  async saveImage() {
    const activeIndex = await this.slides.getActiveIndex();
    let url;
    if (this.platform.is('android')) {
      url = `${cordova.file.dataDirectory}images/${this.images[activeIndex].fileName}`;
    }
    if (this.platform.is('ios')) {
      url = `${cordova.file.dataDirectory.replace(/^file:\/\//, '')}images/${this.images[activeIndex].fileName}`;
    }
    this.socialSharing
      .saveToPhotoAlbum(url)
      .then((result) => {
        console.log(`success:${result}`);
        this.presentSaveImageToast();
      })
      .catch((err) => {
        console.error(`error:${err}`);
      });
  }

  async downloadImage(image: Darshan, index: number) {
    if (this.network.type === this.network.Connection.NONE) {
      this.presentNoConnectionAlert();
    } else {
      this.images[index].isLoading = true;
      this.images[index].isError = false;
      const title = image.url.substr(image.url.lastIndexOf('/') + 1);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .download(image.url, `${cordova.file.dataDirectory}images/${title}`)
        .then(
          _ => {
            this.images[index] = {
              isDownloaded: this.checkIfDownloaded(title),
              fileName: title,
              url: image.url,
              placeholder: image.placeholder,
              isError: false,
              isLoading: false,
              isLoaded: true
            };
          },
          error => {
            // handle error
            console.error(`download error: ${error}`);
            this.images[index] = {
              isDownloaded: this.checkIfDownloaded(title),
              fileName: title,
              url: image.url,
              placeholder: image.placeholder,
              isError: true,
              isLoading: false,
              isLoaded: false
            };
          }
        );
    }

  }

  checkIfDownloaded(title): Promise<boolean> {
    return this.file
      .checkFile(cordova.file.dataDirectory + 'images/', title)
      .then(_ => {
        return true;
      }).
      catch(_ => {
        return false;
      });
  }

  async presentSaveImageAlert() {
    const alert = await this.alertController.create({
      header: 'Save to camera roll',
      subHeader: ``,
      message: ``,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (_) => {
          }
        },
        {
          text: 'OK',
          role: 'ok',
          cssClass: 'secondary',
          handler: (_) => {
            this.saveImage();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentNoConnectionAlert() {
    const alert = await this.alertController.create({
      header: '',
      subHeader: ``,
      message: `Couldn't download image.\nCheck your Internet connection and try again.`,
      buttons: [
        {
          text: 'OK',
          role: 'ok',
          cssClass: 'secondary',
          handler: (_) => {
          }
        }
      ]
    });

    await alert.present();
  }

  async presentSaveImageToast() {
    const toast = await this.toastController.create({
      message: 'Image saved to camera roll.',
      duration: 1500
    });
    toast.present();
  }

}
