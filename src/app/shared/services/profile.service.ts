import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewProfile, UpdateProfile } from '../models/profile';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  createProfile(profile): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}Profile`,
      profile,
      httpOptions
    );
  }

  updateProfile(profileId, profile: UpdateProfile): Observable<any> {
    return this.http.put(
      `${environment.apiAddress}Profile/${profileId}`,
      profile,
      httpOptions
    );
  }

  getProfileById(profileId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Profile/${profileId}`,
      httpOptions
    );
  }
  
  getProfileByUserId(userId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Profile/User/${userId}`,
      httpOptions
    );
  }

  deleteProfile(profileId): Observable<any> {
    return this.http.delete(
      `${environment.apiAddress}Profile/${profileId}`,
      httpOptions
    );
  }
}
