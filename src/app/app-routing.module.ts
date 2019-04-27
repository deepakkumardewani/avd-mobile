import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'audio-detail', loadChildren: './audio-detail/audio-detail.module#AudioDetailPageModule'
  },
  { path: 'darshan-gallery', loadChildren: './darshan-gallery/darshan-gallery.module#DarshanGalleryPageModule' },
  { path: 'video-detail', loadChildren: './video-detail/video-detail.module#VideoDetailPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
