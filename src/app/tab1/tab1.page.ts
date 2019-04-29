import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';

import { Audio } from './../models/audio';
import { AudioDetailPage } from './../audio-detail/audio-detail.page';
import { HelperService } from './../helper.service';

declare var cordova: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  audios: any;
  isLoading = true;
  progress = 0.1;
  page = 1;
  limit = 30;
  isDownloadBtnDisabled = false;
  totalAudios = 0;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private helper: HelperService,
    public modalController: ModalController,
    private file: File,
    private ref: ChangeDetectorRef,
    public toastController: ToastController,
    private storage: Storage,
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    public alertController: AlertController
  ) {
    const self = this;
    this.audios = [];
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      this.totalAudios = result.total;
      this.audios = result.docs.map((audio) => {
        const { title, url, subTitle } = audio;
        return new Audio({
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(title)
        });
      });
      this.isLoading = false;
    });

  }

  ngOnInit() {}

  checkIfDownloaded(title): Promise<boolean> {
    return this.file
    .checkFile(cordova.file.dataDirectory + 'audios/', title + '.mp3').
    then(_ => {
      return true;
    }).
    catch(_ => {
      return false;
    });
 }

 removeFile(audio: Audio) {
  this.file.removeFile(cordova.file.dataDirectory + 'audios/', audio.title + '.mp3')
  .then(_ => {
    audio.isDownloaded = this.checkIfDownloaded(audio.title);
  })
  .catch(_ => {
    audio.isDownloaded = this.checkIfDownloaded(audio.title);
  });
 }
  download(audio: Audio) {
    const { title, url } = audio;
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.isDownloadBtnDisabled = true;
    audio.isDownloading = true;
    audio.progress = 0;
    fileTransfer
      .download(url, cordova.file.dataDirectory + 'audios/' + title + '.mp3')
      .then(
        _ => {
          this.isDownloadBtnDisabled = false;
          audio.isDownloading = false;
          audio.isDownloaded = this.checkIfDownloaded(title);
        },
        _ => {
          // handle error
          // this.errorToast(JSON.stringify(error));
          this.errorToast('Hare Krishna. There was some error. Please try again.');
          this.isDownloadBtnDisabled = false;
          audio.isDownloading = false;
          audio.isDownloaded = this.checkIfDownloaded(title);
          audio.audioPath = '';
        }
      );

    fileTransfer.onProgress(progressEvent => {
      const perc = Math.floor(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      audio.progress = perc;
      this.ref.detectChanges();
    });
  }

  refresh() {
    const self = this;
    this.audios = [];
    this.isLoading = true;
    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      this.totalAudios = result.total;
      this.audios = result.docs.map((audio) => {
        const { title, url, subTitle } = audio;
        return new Audio({
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(title)
        });
      });
      this.isLoading = false;
    });
  }
  async presentModal(audio) {
    if (audio.isDownloaded) {
      const modal = await this.modalController.create({
        component: AudioDetailPage,
        componentProps: {
          audioData: audio
        }
      });
      return await modal.present();
    }
  }

  loadData(event) {
    const self = this;
    this.page ++;
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      const audios = result.docs.map((audio) => {
        const { title, url, subTitle } = audio;
        return new Audio({
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(title)
        });
      });
      this.audios = [ ...this.audios, ...audios];
      this.isLoading = false;
      event.target.complete();

      if (this.audios.length === this.totalAudios) {
        event.target.disabled = true;
      }
    });
  }

  async errorToast(msg) {
    const toast = await this.helper.errorToast(msg, 2000);
    toast.present();
  }

  async presentDeleteAlert(audio: Audio) {
    const alert = await this.alertController.create({
      header: 'Hare Krishna',
      subHeader: '',
      message: 'This will delete the audio. Are you sure?',
      buttons: [
        {
          text: 'Delete',
          role: 'delete',
          cssClass: 'delete-button',
          handler: (_) => {
            this.removeFile(audio);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (_) => {
          }
        }
      ]
    });

    await alert.present();
  }
}
