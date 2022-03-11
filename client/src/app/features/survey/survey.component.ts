import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  activeSurvey?: ActiveSurvey;
  voted = false;

  constructor(router: Router) {
    this.activeSurvey = router.getCurrentNavigation()?.extras.state as ActiveSurvey;
  }

  ngOnInit(): void {
  }

  vote(surveyIndex: number) {
    this.voted = true;
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
}