import { CreateSurveyRoutingModule } from './create-survey-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSurveyComponent } from './create-survey.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateSurveyComponent],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CreateSurveyRoutingModule
  ]
})
export class CreateSurveyModule { }
