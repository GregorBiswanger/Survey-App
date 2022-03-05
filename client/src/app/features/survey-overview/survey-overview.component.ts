import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Survey } from '../create-survey/create-survey.component';
import { SurveyOverviewService } from './survey-overview.service';

@Component({
  selector: 'app-survey-overview',
  templateUrl: './survey-overview.component.html',
  styleUrls: ['./survey-overview.component.scss']
})
export class SurveyOverviewComponent implements OnInit {
  allSurveys?: Observable<Survey[]>

  constructor(private surveyOverviewService: SurveyOverviewService) { }
  
  ngOnInit() {
    this.allSurveys = this.surveyOverviewService.loadAll();
  }
}
