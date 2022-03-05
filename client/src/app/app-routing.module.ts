import { SurveyOverviewComponent } from './features/survey-overview/survey-overview.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppShellComponent } from './_layouts/app-shell/app-shell.component';

const routes: Routes = [
  {
    path: '', component: AppShellComponent, children: [
      { path: '', component: SurveyOverviewComponent },
      { path: 'create-survey', loadChildren: () => import('./features/create-survey/create-survey.module').then(module => module.CreateSurveyModule) }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
