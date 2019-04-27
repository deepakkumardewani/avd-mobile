import { Audio } from './models/audio';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import {
  catchError
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  dailyDarshanUrl = `${environment.serverUrl}/photos/dailyDarshan`;
  dailyAudioUrl = `${environment.serverUrl}/lectures/audio/daily`;
  allAudioUrl = `${environment.serverUrl}/lectures/audio`;
  quotesUrl = `${environment.serverUrl}/quotes`;
  eventsUrl = `${environment.serverUrl}/events`;
  upcomingEventsUrl = `${environment.serverUrl}/events?limit=3`;
  videoListUrl = `${environment.serverUrl}/lectures/video`;

  constructor(
    private http: HttpClient,
    public toastController: ToastController) { }

  getDailyDarshan() {
    return this.http.get(this.dailyDarshanUrl);
  }

  getDailyAudio() {
    return this.http.get(this.dailyAudioUrl);
  }

  getAllAudio(page, limit) {
    // const data = this.http.get<Audio[]>(this.allAudioUrl)
    // .pipe(
    //    catchError(this.handleError)
    //  );
    return this.http.get<Audio[]>(`${this.allAudioUrl}?limit=${limit}&page=${page}`)
    .pipe(
       catchError(this.handleError)
     );
  }

  getQuotes() {
    return this.http.get(this.quotesUrl);
  }

  getEvents() {
    return this.http.get(this.eventsUrl);
  }

  getUpcomingEvents() {
    return this.http.get(this.upcomingEventsUrl);
  }

  getEvent() {
    if (window.localStorage) {
      return JSON.parse(localStorage.getItem('event'));
    }
  }

  getVideoList(token) {
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.videoListUrl, { token });
  }

  setEvent(event) {
    if (window.localStorage) {
      localStorage.setItem('event', JSON.stringify(event));
    }
  }

  clearEvent() {
    if (window.localStorage) {
      localStorage.removeItem('event');
    }
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  errorToast(message, duration) {
    return this.toastController.create({
      message,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Done',
      duration
    });
  }
}
