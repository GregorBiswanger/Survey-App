import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartSurveyComponent } from './start-survey.component';

const routes: Routes = [
  { path: '', component: StartSurveyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartSurveyRoutingModule { }
