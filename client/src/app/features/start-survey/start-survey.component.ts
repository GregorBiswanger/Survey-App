import { ActiveSurvey } from './../survey/survey.component';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Survey } from '../create-survey/create-survey.component';
import { StartSurveyService } from './start-survey.service';

@Component({
  selector: 'app-start-survey',
  templateUrl: './start-survey.component.html',
  styleUrls: ['./start-survey.component.scss']
})
export class StartSurveyComponent {
  survey?: Survey;
  startSurveyForm = this.fb.group({
    duration: [0]
  });

  constructor(private fb: FormBuilder, private router: Router, private startSurveyService: StartSurveyService) {
    this.survey = router.getCurrentNavigation()?.extras.state as Survey;
  }

  onSubmit() {
    if (this.survey) {
      this.startSurveyService.start({
        surveyId: this.survey._id,
        ...this.startSurveyForm.value
      }).subscribe((activeSurvey: ActiveSurvey) => {
        const url = this.router.serializeUrl(
          this.router.createUrlTree(['/survey/' + activeSurvey.connectCode])
        );

        window.open(url, '_blank');
        this.router.navigate(['']);
      });
    }
  }
}
