import { Component, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DarshanGalleryPage } from './../darshan-gallery/darshan-gallery.page';
import { HelperService } from './../helper.service';
import { Darshan } from '../models/darshan';

declare var cordova: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  darshan: Darshan[];
  isLoading = true;
  count = 0;
  constructor(
    private helper: HelperService,
    public modalController: ModalController,
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    private storage: Storage,
    private webview: WebView,
    private file: File,
  ) {
    this.darshan = [];

    this.helper.getDailyDarshan().subscribe(async (result: any) => {
      const { imageUrls } = result;
      this.isLoading = false;
      // for (let i = 0; i < urls.length; i++) {
      //   this.darshan[i] = { url: urls[i], fileName: '', isLoaded: false, local: ''};
      // }
      this.addDummyData(imageUrls);
      this.download(imageUrls);
      // this.storage.set('date', '');
      // this.storage.set('darshan', []);
      // const date = await this.storage.get('date');
      // let toast = await this.helper.errorToast('Error downloading file', 2000);

      // if (date !== '' && date === result.date) {
      //   this.darshan = await this.storage.get('darshan');
      //   this.isLoading = false;
      // } else {
      //   this.download(result.imageUrls);
      // }
      // this.storage.set('date', result.date);
      this.count = imageUrls.length;
    });
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

  async download(urls: string[]) {
    for (let i = 0; i < urls.length; i++) {
      const title = urls[i].substr(urls[i].lastIndexOf('/') + 1);
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer
        .download(urls[i], `${cordova.file.dataDirectory}images/${title}`)
        .then(
          _ => {
            this.darshan[i] = {
              isDownloaded: this.checkIfDownloaded(title),
              fileName: title,
              url: urls[i],
              isLoaded: false
            };
            // if (this.darshan.length === this.count) {
            //   this.isLoading = false;
            //   // this.storage.set('darshan', this.darshan);
            //   // this.storage.set('date', '');
            // }
          },
          error => {
            // handle error
            console.error(error);
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
    // this.storage.set('darshan', []);
    this.isLoading = true;
    this.helper.getDailyDarshan().subscribe(async (result: any) => {
      this.isLoading = false;
      const { imageUrls } = result;
      this.addDummyData(imageUrls);
      this.download(imageUrls);
      // this.storage.set('date', '');
      // this.count = result.imageUrls.length;
      // const date = await this.storage.get('date');

      // if (date !== '' && date === result.date) {
      //   this.darshan = await this.storage.get('darshan');
      //   this.isLoading = false;
      // } else {
      //   this.download(result.imageUrls);
      // }
      // this.storage.set('date', result.date);

    });
  }
  addDummyData(urls) {
    for (let i = 0; i < urls.length; i++) {
      const title = urls[i].substr(urls[i].lastIndexOf('/') + 1);
      this.darshan.push({ url: urls[i], fileName: title, isLoaded: false, isDownloaded: this.checkIfDownloaded(title) });
    }
  }
}
