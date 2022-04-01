import { SurveyOverviewComponent } from './features/survey-overview/survey-overview.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './_layouts/app-shell/app-shell.component';
import { SurveyShellComponent } from './_layouts/survey-shell/survey-shell.component';
import { SurveyComponent } from './features/survey/survey.component';

const routes: Routes = [
  {
    path: '', component: AppShellComponent, children: [
      { path: '', component: SurveyOverviewComponent },
      { path: 'create-survey', loadChildren: () => import('./features/create-survey/create-survey.module').then(module => module.CreateSurveyModule) },
      { path: 'start-survey', loadChildren: () => import('./features/start-survey/start-survey.module').then(module => module.StartSurveyModule) }
    ]
  },
  {
    path: 'survey', component: SurveyShellComponent, children: [
      { path: '', component: SurveyComponent },
      { path: ':connectCode', component: SurveyComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
