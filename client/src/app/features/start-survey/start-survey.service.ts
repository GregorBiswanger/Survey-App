import { Survey } from './../create-survey/create-survey.component';
import { Injectable } from '@angular/core';

import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ActiveSurvey } from '../survey/survey.component';

@Injectable({
  providedIn: 'root'
})
export class StartSurveyService {
  start(startSurveyOptions: StartSurveyOptions) {
    return new Observable<ActiveSurvey>(observer => {
      const socket = io('http://localhost:3000');
      socket.on('connect', () => {
        socket.emit('survey:start', startSurveyOptions, (result: any) => {
          observer.next(result);
          observer.complete();
          socket.disconnect();
        });
      });
    })
  }
}

interface StartSurveyOptions {
  surveyId: string,
  duration: number
}