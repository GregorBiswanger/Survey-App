import { Survey } from './../create-survey/create-survey.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SurveyOverviewService {

  constructor(private httpClient: HttpClient) { }

  loadAll() {
    return this.httpClient.get<Survey[]>('/api/surveys');
  }
}
