import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { environment } from '../../environments/environment';
import { IResponse } from '../shared/iresponse';
import { CookieService } from 'ngx-cookie-service';

const baseUrl = environment.production ? '' : 'http://localhost:8080/';

export interface IUser {
  username: string;
}

export { IResponse };

@Injectable()
export class UserService {
  private cookieName = 'token';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  register(username: string, password: string): Promise<any> {
    const body = {
      username,
      password
    };
    return this.http.post(baseUrl + 'users', body).toPromise();
  }

  login(username: string, password: string): Promise<any> {
    const body = {
      username,
      password
    };
    return this.http.post(baseUrl + 'login', body).do(response => {
      const res = <IResponse>response;
      const token = (<any>res.message).token;
      const expireAt = (<any>res.message).exp;
      this.cookieService.set(this.cookieName, token, new Date(expireAt));
    }, () => this.logOut()).toPromise();
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logOut() {
    this.cookieService.delete(this.cookieName);
  }

  getToken() {
    if (this.cookieService.check(this.cookieName)) {
      return this.cookieService.get(this.cookieName);
    }
    return false;
  }
}
