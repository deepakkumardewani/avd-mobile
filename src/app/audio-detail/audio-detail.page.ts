import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

declare var cordova: any;

@Component({
  selector: 'app-audio-detail',
  templateUrl: './audio-detail.page.html',
  styleUrls: ['./audio-detail.page.scss']
})
export class AudioDetailPage implements OnInit, OnDestroy {
  @ViewChild('audio') audio: ElementRef;
  @Input() audioData: any;

  isPlaying = true;
  duration = 0;
  totalDuration = 0;
  remaining = 0;
  remainingDuration = 0;
  position = 0;
  file: MediaObject;
  progress: number;
  volume = 50;
  progValue = 0;

  isLoaded = false;

  constructor(
    public modalController: ModalController,
    private media: Media,
    private socialSharing: SocialSharing,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.file = this.media.create(this.normalizeURL(this.audioData.title));
    this.file.play();
    if (this.platform.is('android')) {
      this.file.pause();
      this.remaining = Math.floor(this.file.getDuration());
      setTimeout(() => {
        this.file.play();
      }, 1000);
    }
    this.file.onStatusUpdate.subscribe(() => {
      // only assign duration when audio loads first
      if (!this.isLoaded) {
        this.remaining = Math.floor(this.file.getDuration());
      }
      this.isLoaded = true;
      this.totalDuration = Math.floor(this.file.getDuration());
    }); // fires when file status changes

    setInterval(() => {
      this.file.getCurrentPosition().then(position => {
        this.position = Math.floor(position);
        if (this.isPlaying) {
          this.duration = this.position;
          this.remaining = this.remaining - 1;
          if (this.position === -1) {
            this.duration = 0;
            this.remaining = 0;
            this.isPlaying = false;
          }
        }
      });
    }, 1000);
  }

  ionViewWillUnload() {
    this.file.release();
  }
  ngOnDestroy() {
    this.file.release();
  }

  close() {
    this.file.release();
    this.modalController.dismiss();
  }

  toggle() {
    if (this.isPlaying) {
      this.file.pause();
      this.file.getCurrentPosition().then(position => {
        this.position = Math.floor(position);
      });
    } else {
      this.file.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  changeProgress() {
    this.progValue = this.progress;
    this.duration = this.progress;
    this.remaining = this.totalDuration - this.progress;
    this.file.seekTo(this.progress * 1000);
  }

  changeVolume() {
    this.file.setVolume(this.volume / 100);
  }

  async shareAudio() {
    this.file.pause();
    this.isPlaying = false;
    this.socialSharing
      .share(
        null,
        null,
        this.normalizeURL(this.audioData.title),
        null
      )
      .then(() => {
        this.file.play();
        this.isPlaying = true;
      })
      .catch(() => {
        this.file.play();
        this.isPlaying = true;
      });
  }

  normalizeURL(title) {
    const url = `${cordova.file.dataDirectory}audios/${title}.mp3`;
    return url.replace(/^file:\/\//, '');
  }
}
