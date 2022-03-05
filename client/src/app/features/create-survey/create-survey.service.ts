import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, delay, of, retryWhen, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateSurveyService {

  constructor(private httpClient: HttpClient) { }

  create(survey: any) {
    return this.httpClient.post('/api/surveys', survey)
    .pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        return throwError(() => new Error('Something went wrong.'));
      })
    );
  }
}
