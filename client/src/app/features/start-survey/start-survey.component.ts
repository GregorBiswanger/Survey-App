import { ActiveSurvey } from './../survey/survey.component';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  addressForm = this.fb.group({
  });

  constructor(private fb: FormBuilder, private router: Router, private startSurveyService: StartSurveyService) {
    this.survey = router.getCurrentNavigation()?.extras.state as Survey;
  }

  onSubmit() {
    if(this.survey) {
      this.startSurveyService.start(this.survey).subscribe((activeSurvey: ActiveSurvey) => {
        this.router.navigate(['/survey'], { state: activeSurvey });
        console.log('Antwort vom Backend: ', activeSurvey);
      });
    }
  }
}
