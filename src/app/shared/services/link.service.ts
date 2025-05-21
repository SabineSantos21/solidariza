import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(private readonly http: HttpClient) { }

  createLink(link): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}Link`,
      link,
      httpOptions
    );
  }
  
  getLinksByProfileId(profileId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Link/Profile/${profileId}`,
      httpOptions
    );
  }

  deleteLink(linkId): Observable<any> {
    return this.http.delete(
      `${environment.apiAddress}Link/${linkId}`,
      httpOptions
    );
  }
}
