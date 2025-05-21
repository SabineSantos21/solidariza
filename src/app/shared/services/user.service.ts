import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  createUser(user: User): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}User`,
      user,
      httpOptions
    );
  }

  getUserById(userId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}User/${userId}`,
      httpOptions
    );
  }
}
