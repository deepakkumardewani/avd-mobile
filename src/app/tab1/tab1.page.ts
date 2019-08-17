import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    public alertController: AlertController,
    private socialSharing: SocialSharing,
    private platform: Platform
  ) { }

  ngOnInit() {
    const self = this;
    this.audios = [];
    this.addDummyData(30);
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      this.totalAudios = result.total;
      for (let i = 0; i < result.docs.length; i++) {
        const audio = result.docs[i];
        const { title, url, subTitle, _id } = audio;
        this.audios[i] = {
          _id,
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(_id)
        };
      }
      this.isLoading = false;
    });
  }

  checkIfDownloaded(_id: string): Promise<boolean> {
    return this.file
      .checkFile(cordova.file.dataDirectory + 'audios/', _id + '.mp3').
      then(_ => {
        return true;
      }).
      catch(_ => {
        return false;
      });
  }

  removeFile(audio: Audio) {
    this.file.removeFile(cordova.file.dataDirectory + 'audios/', audio._id + '.mp3')
      .then(_ => {
        audio.isDownloaded = this.checkIfDownloaded(audio.title);
      })
      .catch(_ => {
        audio.isDownloaded = this.checkIfDownloaded(audio.title);
      });
  }
  download(audio: Audio) {
    const { url, _id } = audio;
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.isDownloadBtnDisabled = true;
    audio.isDownloading = true;
    audio.progress = 0;
    fileTransfer
      .download(url, cordova.file.dataDirectory + 'audios/' + _id + '.mp3')
      .then(
        _ => {
          this.isDownloadBtnDisabled = false;
          audio.isDownloading = false;
          audio.isDownloaded = this.checkIfDownloaded(_id);
        },
        _ => {
          // handle error
          this.errorToast('Hare Krishna. There was some error. Please try again.');
          this.isDownloadBtnDisabled = false;
          audio.isDownloading = false;
          audio.isDownloaded = this.checkIfDownloaded(_id);
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
    this.addDummyData(30);
    this.isLoading = true;
    this.page = 1;
    this.infiniteScroll.disabled = false;
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      this.totalAudios = result.total;
      for (let i = 0; i < result.docs.length; i++) {
        const audio = result.docs[i];
        const { title, url, subTitle, _id } = audio;
        this.audios[i] = {
          _id,
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(_id)
        };
      }
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
    this.page++;
    this.helper.getAllAudio(this.page, this.limit).subscribe((result: any) => {
      const audios = result.docs.map((audio) => {
        const { title, url, subTitle, _id } = audio;
        return new Audio({
          _id,
          title,
          url,
          subTitle,
          isSaved: false,
          isDownloaded: self.checkIfDownloaded(_id)
        });
      });
      this.audios = [...this.audios, ...audios];
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

  async shareAudio(audio: Audio) {
    this.socialSharing
      .share(
        null,
        null,
        this.normalizeURL(audio._id),
        null
      )
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  normalizeURL(_id: string) {
    const url = `${cordova.file.dataDirectory}audios/${_id}.mp3`;
    if (this.platform.is('android')) {
      return url;
    }
    if (this.platform.is('ios')) {
      return url.replace(/^file:\/\//, '');
    }
  }

  addDummyData(length) {
    for (let i = 0; i < length; i++) {
      const audio = new Audio({ title: '', subTitle: '', url: '', isSaved: false, isDownloading: false, isDownloaded: false });
      this.audios.push(audio);
    }
  }
}
