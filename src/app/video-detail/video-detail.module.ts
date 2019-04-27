import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VideoDetailPage } from './video-detail.page';
import { PipeModule } from '../pipe.module';


const routes: Routes = [
  {
    path: '',
    component: VideoDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ VideoDetailPage ]
})
export class VideoDetailPageModule {}
