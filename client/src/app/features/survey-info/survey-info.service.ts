import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveSurvey } from '../survey/survey.component';

@Injectable({
  providedIn: 'root'
})
export class SurveyInfoService {

  constructor(private httpClient: HttpClient) { }

  loadActiveSurveys(surveyId: string) {
    const params = new HttpParams().set('surveyId', surveyId);

    return this.httpClient.get<ActiveSurvey[]>('/api/active-surveys', { params });
  }
}
