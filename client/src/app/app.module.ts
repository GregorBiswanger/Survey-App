import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppShellComponent } from './_layouts/app-shell/app-shell.component';

import { SurveyOverviewComponent } from './features/survey-overview/survey-overview.component';
import { CoreModule } from './core/core.module';
import { SurveyShellComponent } from './_layouts/survey-shell/survey-shell.component';

@NgModule({
  declarations: [
    AppComponent,
    AppShellComponent,
    SurveyOverviewComponent,
    SurveyShellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
