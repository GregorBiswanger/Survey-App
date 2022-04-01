import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyInfoRoutingModule } from './survey-info-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SurveyInfoComponent } from './survey-info.component';


@NgModule({
  declarations: [
    SurveyInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SurveyInfoRoutingModule
  ]
})
export class SurveyInfoModule { }
