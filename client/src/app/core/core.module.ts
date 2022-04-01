import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SurveyModule } from '../features/survey/survey.module';
import { MaterialModule } from '../shared/material.module';
import { GlobalHttpErrorInterceptorService } from '../shared/services/global-http-error-interceptor.service';

@NgModule({
  exports: [
    MaterialModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    SurveyModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
