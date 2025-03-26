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
export class CampaignVolunteerService {

  constructor(private http: HttpClient) { }
  
  getCampaignVolunteerById(campaignVolunteerId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}CampaignVolunteer/${campaignVolunteerId}`,
      httpOptions
    );
  }

  getCampaignVolunteerByCampaignId(campaignId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}CampaignVolunteer/Campaign/${campaignId}`,
      httpOptions
    );
  }
  
  getCampaignVolunteerByUserId(userId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}CampaignVolunteer/User/${userId}`,
      httpOptions
    );
  }

  createCampaignVolunteer(campaignVolunteer): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}CampaignVolunteer`,
      campaignVolunteer,
      httpOptions
    );
  }

  updateCampaignVolunteer(campaignVolunteerId, campaignVolunteer): Observable<any> {
    return this.http.put(
      `${environment.apiAddress}CampaignVolunteer/${campaignVolunteerId}`,
      campaignVolunteer,
      httpOptions
    );
  }

  deleteCampaignVolunteer(campaignVolunteerId): Observable<any> {
    return this.http.delete(
      `${environment.apiAddress}CampaignVolunteer/${campaignVolunteerId}`,
      httpOptions
    );
  }
}
