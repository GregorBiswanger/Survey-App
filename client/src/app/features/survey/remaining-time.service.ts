import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RemainingTimeService {
  startCountdown(durationInMs: number, remainingTimeMs: number) {
    return new Observable<number>(observer => {
      const receivedAt = new Date();
      let intervalHandle = 0;
      let remainingTimeInPercent = this.calculateRemainingTimeInPercent(receivedAt, durationInMs, remainingTimeMs);
      observer.next(remainingTimeInPercent);

      if (intervalHandle) {
        window.clearInterval(intervalHandle);
      }

      if (remainingTimeInPercent <= 0) {
        observer.complete();
        return;
      }

      intervalHandle = window.setInterval(() => {
        remainingTimeInPercent = this.calculateRemainingTimeInPercent(receivedAt, durationInMs, remainingTimeMs);
        observer.next(remainingTimeInPercent);

        if (remainingTimeInPercent <= 0) {
          window.clearInterval(intervalHandle);
          observer.complete();
        }
      }, 200);

      return () => {
        window.clearInterval(intervalHandle);
      }
    });
  }

  private calculateRemainingTimeInPercent(receivedAt: Date, durationInMs: number, remainingTimeMs: number) {
    const durationSinceActiveSurveyWasReceivedInMs = Date.now() - receivedAt.getTime();
    const remainingTimeInMs = remainingTimeMs - durationSinceActiveSurveyWasReceivedInMs;

    return Math.max(100 * remainingTimeInMs / durationInMs, 0);
  }
}
