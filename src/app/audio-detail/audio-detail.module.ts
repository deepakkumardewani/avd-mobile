import { PipeModule } from './../pipe.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AudioDetailPage } from './audio-detail.page';
const routes: Routes = [
  {
    path: '',
    component: AudioDetailPage
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
  declarations: [AudioDetailPage ]
})
export class AudioDetailPageModule {}
