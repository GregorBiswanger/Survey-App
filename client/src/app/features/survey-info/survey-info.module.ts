import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyInfoRoutingModule } from './survey-info-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SurveyInfoComponent } from './survey-info.component';
import { DateFromObjectIdPipe } from './date-from-object-id.pipe';


@NgModule({
  declarations: [
    SurveyInfoComponent,
    DateFromObjectIdPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    SurveyInfoRoutingModule
  ]
})
export class SurveyInfoModule { }
