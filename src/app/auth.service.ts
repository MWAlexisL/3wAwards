import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
import {FormGroup} from '@angular/forms';
import * as jwtdecode from 'jwt-decode';

@Injectable()
export class AuthService {

  // temporary variable for the dev
  localUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {
  }
  private subject = new Subject<any>();
  isConnected = new EventEmitter<boolean>();

  sendIsConnected(isConnected: boolean) {
    this.subject.next(isConnected);
    this.isConnected.emit(isConnected);
  }
  getIsConnected(): Observable<any> {
    return this.subject.asObservable();
  }
  login(_username: string, _password: string) {
    const body = new FormData();
    body.append('_username', _username);
    body.append('_password', _password);

    this.http.post(this.localUrl + 'login_check', body).subscribe(
      res => {
        console.log(res);
        this.setTokenInLocalStorage(res);
        this.sendIsConnected(true);
      },
      err => {
      }
    );
  }

  signUp(form: FormGroup) {
    console.log(form.value);

    const filterKeys = Object.keys(form.value);
    const body = new FormData();
    for (let i = 0; i < filterKeys.length; i++) {
      console.log(form.value[filterKeys[i]]);
      body.append(filterKeys[i], form.value[filterKeys[i]]);
    }
    this.http.post(this.localUrl + 'register', body).subscribe( res => {
      console.log(res);
    });
  }

  private setTokenInLocalStorage(authResult) {
    const expireAR = moment().add(authResult.expiresIn, 'second');
    const Usertoken = JSON.parse(JSON.stringify(authResult));
    localStorage.setItem('user_token', Usertoken.token);
    localStorage.setItem('expires_at', JSON.stringify(expireAR.valueOf()));
  }

  logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('expires_at');
    this.sendIsConnected(false);
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getUserInfo(token: string) {
    const decoded = jwtdecode(token);
    console.log(decoded);
    return decoded;
  }
}


