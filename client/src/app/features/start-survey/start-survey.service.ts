import { Survey } from './../create-survey/create-survey.component';
import { Injectable } from '@angular/core';

import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartSurveyService {
  start(survey: Survey) {
    return new Observable(observer => {
      const socket = io('http://localhost:3000');
      socket.on('connect', () => {
        socket.emit('survey:start', survey._id, (result: any) => {
          observer.next(result);
          observer.complete();
          socket.disconnect();
        });
      });
    })
  }
}
