import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ActiveSurvey } from './survey.component';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor() { }

  vote(activeSurveyId: string, voteIndex: number) {
    return new Observable<ActiveSurvey>((observer) => {
      const socket = io('http://localhost:3000');
      socket.on('survey:voted', (activeSurvey: ActiveSurvey) => {
        observer.next(activeSurvey);
      });

      socket.emit('survey:vote', activeSurveyId, voteIndex);

      return () => {
        socket.disconnect();
      }
    });
  }
}