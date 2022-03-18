import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SurveyService } from './survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {
  activeSurvey?: ActiveSurvey;
  votedIndex = -1;
  votedSubscription?: Subscription;
  connectCode = '';
  pageReady = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private surveyService: SurveyService) {
    this.activeSurvey = router.getCurrentNavigation()?.extras.state as ActiveSurvey;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.connectCode = params['connectCode'];

      if(this.activeSurvey === undefined && this.connectCode) {
        this.surveyService.loadActiveSurvey(this.connectCode).subscribe(activeSurvey => {
          this.activeSurvey = activeSurvey;
          this.pageReady = true;
        });
      } else {
        this.pageReady = true;
      }
    });
  }
  
  navigateToEnteredConnectCode() {
    this.router.navigate(['survey', this.connectCode]);
  }

  vote(surveyIndex: number) {
    if (this.activeSurvey) {
      this.votedIndex = surveyIndex;

      this.votedSubscription = this.surveyService.vote(this.activeSurvey._id!, surveyIndex)
        .subscribe(activeSurvey => {
          this.activeSurvey = activeSurvey;
          console.log(activeSurvey);
        });
    }
  }

  getPercentageWidthStyle(voteAnswer: VoteAnswer) {
    return {
      width: voteAnswer.voteInPercent + '%'
    }
  }

  ngOnDestroy() {
    this.votedSubscription?.unsubscribe();
  }
}

export interface ActiveSurvey {
  _id?: string;
  totalVotesCount: number;
  connectCode: string;
  survey: VoteSurvey;
}

export interface VoteSurvey {
  _id: string;
  question: string;
  answers: VoteAnswer[];
}

export interface VoteAnswer {
  answer: string;
  voteCount: number;
  voteInPercent: number;
}