import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyComponent } from './survey.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SurveyComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    SurveyRoutingModule
  ]
})
export class SurveyModule { }
