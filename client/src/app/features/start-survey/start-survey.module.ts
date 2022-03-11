import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartSurveyRoutingModule } from './start-survey-routing.module';
import { StartSurveyComponent } from './start-survey.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StartSurveyComponent],
  imports: [
    SharedModule,
    CommonModule,
    StartSurveyRoutingModule,
    ReactiveFormsModule
  ]
})
export class StartSurveyModule { }
