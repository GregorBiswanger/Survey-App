import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateSurveyValidator {
  public minTwoAnswers(): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const answer0Control = abstractControl.get('answer-0');
      const answer1Control = abstractControl.get('answer-1');

      if(answer0Control?.value && answer1Control?.value) {
        return null;
      }

      return { minTwoAnswers: true }
    }
  }
}
