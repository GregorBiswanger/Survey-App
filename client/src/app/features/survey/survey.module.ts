import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyComponent } from './survey.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    SurveyComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    SurveyRoutingModule,
    QRCodeModule,
    ClipboardModule
  ]
})
export class SurveyModule { }
