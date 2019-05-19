import { VideoDetailPage } from './../video-detail/video-detail.page';
import { Component } from '@angular/core';
import { HelperService } from '../helper.service';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  videos: any;
  isLoading = true;
  token = '';
  totalData = 0;
  publishedAt: string;

  constructor(
    private helper: HelperService,
    public modalController: ModalController
  ) {
    this.helper.getVideoList(this.token).subscribe((result: any) => {
      this.publishedAt = result.publishedAt;
      this.videos = result.videos;
      this.totalData = result.totalResults;
      this.isLoading = false;
      this.token = result.token;

    });
  }

  async presentModal(video) {
    const modal = await this.modalController.create({
      component: VideoDetailPage,
      componentProps: {
        videoData: video
      }
    });
    return await modal.present();
  }

  loadData(event) {
    this.helper.getVideoList(this.token).subscribe((result: any) => {
      this.videos = [...this.videos, ...result.videos];
      this.isLoading = false;
      this.token = result.token;

      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.videos.length === this.totalData) {
        event.target.disabled = true;
      }
    });
  }

  YTDurationToSeconds(duration) {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    match = match.slice(1).map(function (x) {
      if (x != null) {
        return x.replace(/\D/, '');
      }
    });

    const hours = (parseInt(match[0]) || 0);
    const minutes = (parseInt(match[1]) || 0);
    const seconds = (parseInt(match[2]) || 0);

    return hours * 3600 + minutes * 60 + seconds;
  }

}
