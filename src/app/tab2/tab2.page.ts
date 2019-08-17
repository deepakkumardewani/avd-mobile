import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Network } from '@ionic-native/network/ngx';
import { DarshanGalleryPage } from './../darshan-gallery/darshan-gallery.page';
import { HelperService } from './../helper.service';
import { Darshan } from '../models/darshan';

declare var cordova: any;



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {
  darshan: Darshan[];
  isLoading = true;
  count = 0;
  date: string;

  // watch network for a disconnection
  disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    setTimeout(() => {
      console.log('network was disconnected :-(');
      for (let i = 0; i < this.darshan.length; i++) {
        this.darshan[i].isError = true;
      }
    }, 3000);
  });
  constructor(
    private helper: HelperService,
    public modalController: ModalController,
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    private webview: WebView,
    private file: File,
    public sanitizer: DomSanitizer,
    private network: Network,
    public alertController: AlertController,

  ) {


    this.darshan = [];

    this.helper.getDailyDarshan().subscribe(async (result: any) => {

      const { imageUrls, createdAt } = result;
      this.date = createdAt;
      this.isLoading = false;
      this.addDummyData(imageUrls);
      this.download(imageUrls);
      this.count = imageUrls.length;
    });
  }

  ngOnDestroy(): void {
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
  }


  async download(urls: any[]) {
    for (let i = 0; i < urls.length; i++) {
      const title = urls[i].url.substr(urls[i].url.lastIndexOf('/') + 1);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .download(urls[i].url, `${cordova.file.dataDirectory}images/${title}`)
        .then(
          _ => {
            this.darshan[i] = {
              isDownloaded: this.checkIfDownloaded(title),
              fileName: title,
              url: urls[i].url,
              placeholder: urls[i].placeholder,
              isError: false,
              isLoaded: true
            };
          },
          error => {
            // handle error
            console.error(`download error: ${error}`);
            this.darshan[i] = {
              isDownloaded: this.checkIfDownloaded(title),
              fileName: title,
              url: urls[i].url,
              placeholder: urls[i].placeholder,
              isError: true,
              isLoaded: false
            };
          }
        );
    }
  }

  async downloadImage(image: Darshan, index: number) {
    if (this.network.type === this.network.Connection.NONE) {
      this.presentNoConnectionAlert();
    } else {
      this.darshan[index].isLoading = true;
      this.darshan[index].isError = false;
      const title = image.url.substr(image.url.lastIndexOf('/') + 1);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .download(image.url, `${cordova.file.dataDirectory}images/${title}`)
        .then(
          _ => {
            this.darshan[index] = {
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
            this.darshan[index] = {
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
      console.log('internet connection');
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

  normalizeURL(title) {
    const url = `${cordova.file.dataDirectory}images/${title}`;
    return this.webview.convertFileSrc(url);
    // return (
    //   'http://localhost:8080' +
    //   cordova.file.dataDirectory.replace(/^file:\/\//, '') +
    //   'images/' +
    //   title
    // );
  }

  refresh() {
    this.darshan = [];
    this.isLoading = true;
    this.helper.getDailyDarshan().subscribe(async (result: any) => {
      this.isLoading = false;
      const { imageUrls } = result;
      this.addDummyData(imageUrls);
      this.download(imageUrls);
    });
  }
  imgURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  addDummyData(urls) {
    for (let i = 0; i < urls.length; i++) {
      const title = urls[i].url.substr(urls[i].url.lastIndexOf('/') + 1);
      // tslint:disable-next-line:max-line-length
      this.darshan.push({ url: urls[i].url, placeholder: urls[i].placeholder, fileName: title, isError: false, isLoaded: false, isDownloaded: new Promise((resolve, _) => resolve(false)) });
    }
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

  async presentModal(images, index) {
    const modal = await this.modalController.create({
      component: DarshanGalleryPage,
      componentProps: {
        images: images,
        index: index
      }
    });
    return await modal.present();
  }
}
