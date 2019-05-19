import { NgModule } from '@angular/core';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
@NgModule({
  imports: [],
  declarations: [
    ShortNumberPipe,
    DurationPipe,
    DateAgoPipe
  ],
  exports: [
    ShortNumberPipe,
    DurationPipe,
    DateAgoPipe
  ]
})
export class PipeModule {}
