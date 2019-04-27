import { NgModule } from '@angular/core';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { DurationPipe } from './pipes/duration.pipe';
@NgModule({
  imports: [],
  declarations: [
    ShortNumberPipe,
    DurationPipe
  ],
  exports: [
    ShortNumberPipe,
    DurationPipe
  ]
})
export class PipeModule {}
