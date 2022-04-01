import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyInfoComponent } from './survey-info.component';

const routes: Routes = [
  { path: '', component: SurveyInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyInfoRoutingModule { }
