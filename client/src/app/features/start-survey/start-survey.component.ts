import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Survey } from '../create-survey/create-survey.component';

@Component({
  selector: 'app-start-survey',
  templateUrl: './start-survey.component.html',
  styleUrls: ['./start-survey.component.scss']
})
export class StartSurveyComponent {
  survey?: Survey;
  addressForm = this.fb.group({
  });

  constructor(private fb: FormBuilder, router: Router) {
    this.survey = router.getCurrentNavigation()?.extras.state as Survey;
  }

  onSubmit(): void {
    alert('Thanks!');
  }
}
