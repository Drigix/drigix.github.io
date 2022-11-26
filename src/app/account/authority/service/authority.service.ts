import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { head } from 'lodash';
import { Observable } from 'rxjs';
import { webSocket } from "rxjs/webSocket";
import { User } from 'src/app/entities/user/user.model';

interface Jwt {
  accessToken?: string;
  role?: string;
  permissions?: string [];
}

export type EntityResponseType = HttpResponse<User>;
export type EntityArrayResponseType = HttpResponse<User[]>;

export var globalHeaders: any;

@Injectable({
  providedIn: 'root',
})
export class AuthorityService {

  private resourceUrl = 'https://reservio.azurewebsites.net';
  LOGIN_URL = this.resourceUrl + '/Account/sign-in';
  SIGNUP_URL = this.resourceUrl + '/Account/sign-up';
  CHANGE_PASSWORD_URL = this.resourceUrl + '/Account/password-change';
  RESET_PASSWORD_URL = this.resourceUrl + '/Account/password-reset';
  ACCOUNT_DETAILS_URL = this.resourceUrl + '/Account/details';

  jwt: Jwt | null = null;

  headers: HttpHeaders | null = null;

  constructor(private http: HttpClient) {}


  login(email: string, password: string): Observable<string> {
    return this.http.post(this.LOGIN_URL, { email, password }, {responseType: 'text'});
  }

  loguot(): void {
    localStorage.setItem('jwt', '');
    window.location.reload();
  }

  signup(user: User): Observable<any> {
    return this.http.post(this.SIGNUP_URL, user);
  }

  getUserData(): Observable<EntityResponseType> {
    return this.http.get<User>(this.ACCOUNT_DETAILS_URL, {headers: this.headers!, observe: 'response'});
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(this.CHANGE_PASSWORD_URL, {currentPassword, newPassword}, {headers: this.headers!});
  }

  resetPassword(email: string): Observable<any> {
    return this.http.put(this.RESET_PASSWORD_URL, {email});
  }

  changeUserData(user: User): Observable<any> {
    return this.http.put(this.ACCOUNT_DETAILS_URL, user, {headers: this.headers!});
  }

  checkJwt(): boolean {
    const jsonJwt = localStorage.getItem('jwt');
    if (jsonJwt) {
      this.jwt = JSON.parse(jsonJwt!);
      this.headers = new HttpHeaders({'Authorization': ' Bearer ' + this.jwt!.accessToken});
      globalHeaders = this.headers;
    }
    return this.jwt ? true : false;
  }
}
