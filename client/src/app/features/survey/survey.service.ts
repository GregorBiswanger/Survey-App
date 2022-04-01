import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ActiveSurvey } from './survey.component';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  socket = io('/');

  constructor(private httpClient: HttpClient) { }

  loadActiveSurvey(connectCode: string) {
    return this.httpClient.get<ActiveSurvey>('/api/active-surveys/' + connectCode);
  }

  vote(activeSurveyId: string, voteIndex: number) {
    return new Observable<ActiveSurvey>((observer) => {
      this.socket.on('survey:voted', (activeSurvey: ActiveSurvey) => {
        observer.next(activeSurvey);
      });

      this.socket.emit('survey:vote', activeSurveyId, voteIndex);
      localStorage.setItem(activeSurveyId, voteIndex.toString());
    });
  }

  listenVoting(connectCode: string) {
    return new Observable<ActiveSurvey>(observer => {
      this.socket.on('survey:voted', (activeSurvey: ActiveSurvey) => {
        observer.next(activeSurvey);
      });

      this.socket.emit('survey:listen', connectCode);
    });
  }

  canVote(activeSurveyId: string) {
    return !localStorage.getItem(activeSurveyId);
  }

  stop(connectCode: string) {
    this.socket.emit('survey:stop', connectCode);
  }

  listenStopped(connectCode: string) {
    return new Observable(observer => {
      this.socket.on('survey:stopped', () => {
        observer.next();
        observer.complete();
      });

      this.socket.emit('survey:listenStopped', connectCode);
    });
  }

  lastVotedIndex(activeSurveyId: string) {
    return Number.parseInt(localStorage.getItem(activeSurveyId) || '-1');
  }
}
