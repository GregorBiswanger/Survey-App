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
  votedIndex = -1;
  connectCode = '';
  pageReady = false;
  surveyUrl = window.location.href;
  active = true;
  votedSubscription?: Subscription;
  remainingTimeInPercent = 100;

  get activeSurvey() {
    return this._activeSurvey!;
  }

  set activeSurvey(activeSurvey: ActiveSurvey) {
    this._activeSurvey = activeSurvey;

    if (activeSurvey && activeSurvey.options.duration) {
      this._receivedAt = new Date();
      this.updateRemainingTime();
    }
  }

  private _activeSurvey?: ActiveSurvey;
  private _intervalHandle?: number;
  private _receivedAt?: Date;

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private surveyService: SurveyService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.connectCode = params['connectCode'];

      if (this.activeSurvey === undefined && this.connectCode) {
        this.listenSurveyStopped();
        this.loadActiveSurvey();
      } else {
        this.pageReady = true;
      }
    });
  }

  listenSurveyStopped() {
    this.surveyService.listenStopped(this.connectCode).subscribe(() => {
      this.active = false;
      this.updateRemainingTime();
    });
  }

  loadActiveSurvey() {
    this.surveyService.loadActiveSurvey(this.connectCode).subscribe(activeSurvey => {
      this.activeSurvey = activeSurvey;
      this.pageReady = true;

      if (!activeSurvey) {
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
    return this.activeSurvey && this.surveyService.canVote(this.activeSurvey._id!) && this.active;
  }

  getPercentageWidthStyle(voteAnswer: VoteAnswer) {
    const percent = this.votedIndex > -1 ? voteAnswer.voteInPercent : 0;
    return {
      width: percent + '%'
    }
  }

  private updateRemainingTime() {
    this.remainingTimeInPercent = this.calculateRemainingTimeInPercent();

    if (this._intervalHandle) {
      window.clearInterval(this._intervalHandle);
    }

    if (this.remainingTimeInPercent <= 0) {
      return;
    }

    this._intervalHandle = window.setInterval(() => {
      this.remainingTimeInPercent = this.calculateRemainingTimeInPercent();
      if (this.remainingTimeInPercent <= 0) {
        window.clearInterval(this._intervalHandle);
      }
    }, 200);
  }

  private calculateRemainingTimeInPercent() {
    if (!this.active) {
      return 0;
    }

    const durationInMs = this.activeSurvey!.options.duration;
    const durationSinceActiveSurveyWasReceivedInMs = Date.now() - this._receivedAt!.getTime();
    const remainingTimeInMs = this.activeSurvey!.remainingTimeMs - durationSinceActiveSurveyWasReceivedInMs;
    return Math.max(100 * remainingTimeInMs / durationInMs, 0);
  }

  trackAnswer(index: number, answer: VoteAnswer) {
    return index;
  }

  stopSurvey() {
    this.surveyService.stop(this.connectCode);
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