import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DarshanGalleryPage } from './darshan-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: DarshanGalleryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DarshanGalleryPage]
})
export class DarshanGalleryPageModule {}
