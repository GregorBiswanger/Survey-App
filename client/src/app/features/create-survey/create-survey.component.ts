import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateSurveyValidator } from './create-survey-validator';
import { CreateSurveyService } from './create-survey.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  answersCount = 5;

  questionForm = this.fb.group({
    question: ['', Validators.required]
  }, {
    validators: [this.createSurveyValidator.minTwoAnswers()]
  });

  constructor(private fb: FormBuilder, 
    private createSurveyValidator: CreateSurveyValidator,
    private createSurveyService: CreateSurveyService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    for (let index = 0; index < this.answersCount; index++) {
      this.questionForm.setControl('answer-' + index, new FormControl());
    }
  }

  addAnswer() {
    this.questionForm.setControl('answer-' + this.answersCount, new FormControl());
    this.answersCount++;
  }

  onSubmit() {
    const survey: Survey | Record<string, any> = {
      answers: []
    };

    const formData = this.questionForm.value;

    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const value = formData[key];
        if (key.startsWith('answer-') && value) {
          survey['answers'].push(value);
        } else if (value) {
          survey[key] = value;
        }
      }
    }

    console.log(JSON.stringify(survey));

    this.createSurveyService.create(survey)
      .subscribe(
        {
          next: (result) => {
            console.log(result);

            alert('Thanks!');
          },
          error: (error) => {
            this.snackBar.open(error.message, 'OK');
          }
        })

  }
}

export interface Survey {
  question: string;
  answers: string[];
}