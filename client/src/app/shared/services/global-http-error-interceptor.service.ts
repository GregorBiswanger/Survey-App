import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, delay, Observable, of, retryWhen, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpErrorInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen(error => error.pipe(
        concatMap((error, count) => {
          if(count < 3 && error.status === 504) {
            return of(error);
          }

          return throwError(() => new Error(error));
        }),
        delay(1000)
      )),
    );
  }
}
