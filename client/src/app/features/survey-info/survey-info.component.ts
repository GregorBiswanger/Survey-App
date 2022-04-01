import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Survey } from '../create-survey/create-survey.component';
import { ActiveSurvey } from '../survey/survey.component';
import { SurveyInfoService } from './survey-info.service';

@Component({
  selector: 'app-survey-info',
  templateUrl: './survey-info.component.html',
  styleUrls: ['./survey-info.component.scss']
})
export class SurveyInfoComponent implements OnInit {
  survey?: Survey;
  activeSurveys?: ActiveSurvey[];

  constructor(router: Router, private surveyInfoService: SurveyInfoService) { 
    this.survey = router.getCurrentNavigation()?.extras.state as Survey;
  }

  ngOnInit() {
    if(this.survey?._id) {
      this.surveyInfoService.loadActiveSurveys(this.survey._id).subscribe(activeSurveys => {
        this.activeSurveys = activeSurveys;
      });
    }
  }

}
