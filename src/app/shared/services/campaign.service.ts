import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }),
};

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private readonly http: HttpClient) { }

  getCampaigns(): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Campaign`,
      httpOptions
    );
  }
  
  getCampaignById(campaignId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Campaign/${campaignId}`,
      httpOptions
    );
  }

  getCampaignByUserId(userId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Campaign/User/${userId}`,
      httpOptions
    );
  }

  createCampaign(campaign): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}Campaign`,
      campaign,
      httpOptions
    );
  }

  updateCampaign(campaignId, campaign): Observable<any> {
    return this.http.put(
      `${environment.apiAddress}Campaign/${campaignId}`,
      campaign,
      httpOptions
    );
  }

  deleteCampaign(campaignId): Observable<any> {
    return this.http.delete(
      `${environment.apiAddress}Campaign/${campaignId}`,
      httpOptions
    );
  }
}
