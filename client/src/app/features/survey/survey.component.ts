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
  connectCode = '';
  pageReady = false;
  surveyUrl = '';
  active = true;

  votedSubscription?: Subscription;

  remainingTimeInPercent = 100;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private surveyService: SurveyService) {
    this.setActiveSurvey(router.getCurrentNavigation()?.extras.state as ActiveSurvey);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.connectCode = params['connectCode'];
      this.surveyUrl = window.location.href;

      if (this.connectCode) {
        this.surveyService.listenStopped(this.connectCode).subscribe(() => {
          this.active = false;
          this.updateRemainingTime();
        });
      }

      if(this.activeSurvey === undefined && this.connectCode) {
        this.surveyService.loadActiveSurvey(this.connectCode).subscribe(activeSurvey => {
          this.setActiveSurvey(activeSurvey);
          this.pageReady = true;

          if (!activeSurvey) {
            return;
          }

          this.votedIndex = this.surveyService.lastVotedIndex(activeSurvey._id!);
          if (!this.surveyService.canVote(activeSurvey._id!)) {
            this.votedSubscription = this.surveyService.listenVoting(this.connectCode).subscribe(activeSurvey => {
              this.setActiveSurvey(activeSurvey);
            });
          }
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
    if (this.activeSurvey && this.surveyService.canVote(this.activeSurvey._id!) && this.active) {
      this.votedIndex = surveyIndex;

      this.votedSubscription = this.surveyService.vote(this.activeSurvey._id!, surveyIndex)
        .subscribe(activeSurvey => {
          this.setActiveSurvey(activeSurvey);
          console.log(activeSurvey);
        });
    }
  }

  getPercentageWidthStyle(voteAnswer: VoteAnswer) {
    const percent = this.votedIndex > -1 ? voteAnswer.voteInPercent : 0;
    return {
      width: percent + '%'
    }
  }

  private intervalHandle?: number;
  private receivedAt?: Date;
  private setActiveSurvey(activeSurvey: ActiveSurvey | undefined)
  {
    this.activeSurvey = activeSurvey;
    if (activeSurvey && activeSurvey.options.duration) {
      this.receivedAt = new Date();
      this.updateRemainingTime();
    }
  }

  private updateRemainingTime() {
    this.remainingTimeInPercent = this.calculateRemainingTimeInPercent();

    if (this.intervalHandle) {
      window.clearInterval(this.intervalHandle);
    }

    if (this.remainingTimeInPercent <= 0) {
      return;
    }

    this.intervalHandle = window.setInterval(() => {
      this.remainingTimeInPercent = this.calculateRemainingTimeInPercent();
      if (this.remainingTimeInPercent <= 0) {
        window.clearInterval(this.intervalHandle);
      }
    }, 200);
  }

  private calculateRemainingTimeInPercent() {
    if (!this.active) {
      return 0;
    }

    const durationInMs = this.activeSurvey!.options.duration;
    const durationSinceActiveSurveyWasReceivedInMs = Date.now() - this.receivedAt!.getTime();
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