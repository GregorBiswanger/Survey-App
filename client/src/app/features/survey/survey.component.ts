import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RemainingTimeService } from './remaining-time.service';
import { SurveyService } from './survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {
  votedIndex = -1;
  connectCode = '';
  readyToShow = false;
  surveyUrl = window.location.href;
  isSurveyActive = true;
  votedSubscription?: Subscription;
  startCountdownSubscription?: Subscription;
  remainingTimeInPercent = 100;

  get isVoted() {
    return this.votedIndex > -1;
  }

  get activeSurvey() {
    return this._activeSurvey!;
  }

  set activeSurvey(activeSurvey: ActiveSurvey) {
    this._activeSurvey = activeSurvey;

    if (activeSurvey && activeSurvey.options.duration) {
      this.startCountdownSubscription?.unsubscribe();

      this.startCountdownSubscription = this.remainingTimeService.startCountdown(activeSurvey.options.duration, activeSurvey.remainingTimeMs)
        .subscribe(remainingTimeInPercent => {
          this.remainingTimeInPercent = remainingTimeInPercent;
        });
    }
  }

  private _activeSurvey?: ActiveSurvey;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private remainingTimeService: RemainingTimeService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.connectCode = params['connectCode'];

      if (this.activeSurvey === undefined && this.connectCode) {
        this.listenSurveyStopped();
        this.loadActiveSurvey();
      } else {
        this.readyToShow = true;
      }
    });
  }

  listenSurveyStopped() {
    this.surveyService.listenStopped(this.connectCode).subscribe(() => {
      this.isSurveyActive = false;
      this.startCountdownSubscription?.unsubscribe();
      this.remainingTimeInPercent = 0;
    });
  }

  loadActiveSurvey() {
    this.surveyService.loadActiveSurvey(this.connectCode).subscribe(activeSurvey => {
      this.activeSurvey = activeSurvey;
      this.readyToShow = true;

      if (activeSurvey === undefined) {
        return;
      }

      this.votedIndex = this.surveyService.lastVotedIndex(activeSurvey._id!);
      
      if (this.isNotPossibleToVote()) {
        this.listenVoting();
      }
    });
  }

  isNotPossibleToVote() {
    return !this.surveyService.canVote(this.activeSurvey?._id!);
  }

  listenVoting() {
    this.votedSubscription = this.surveyService.listenVoting(this.connectCode)
      .subscribe(activeSurvey => this.activeSurvey = activeSurvey);
  }

  reloadPageWithConnectCode() {
    this.router.navigate(['survey', this.connectCode]);
  }

  vote(surveyIndex: number) {
    if (this.isPossibleToVote()) {
      this.votedIndex = surveyIndex;

      this.votedSubscription = this.surveyService.vote(this.activeSurvey?._id!, surveyIndex)
        .subscribe(activeSurvey => this.activeSurvey = activeSurvey);
    }
  }

  isPossibleToVote() {
    return this.activeSurvey && this.surveyService.canVote(this.activeSurvey._id!) && this.isSurveyActive;
  }

  getPercentageWidthStyle(voteAnswer: VoteAnswer) {
    const percent = this.votedIndex > -1 ? voteAnswer.voteInPercent : 0;
    return {
      width: percent + '%'
    }
  }

  trackAnswer(index: number, answer: VoteAnswer) {
    return index;
  }

  stopSurvey() {
    this.surveyService.stop(this.connectCode);
  }

  ngOnDestroy() {
    this.votedSubscription?.unsubscribe();
    this.startCountdownSubscription?.unsubscribe();
  }
}

export interface ActiveSurvey {
  _id?: string;
  totalVotesCount: number;
  connectCode: string;
  survey: VoteSurvey;
  remainingTimeMs: number;
  options: {
    duration: number
  }
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