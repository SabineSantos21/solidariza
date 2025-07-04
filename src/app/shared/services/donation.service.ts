import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "Application/json",
    Authorization: `Bearer ${localStorage.getItem('token')?.replace(/^"(.*)"$/, '$1')}`
  }),
};

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private readonly http: HttpClient) { }

  getDonationQRCode(campaignId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}Donation/QRCode/${campaignId}`,
      httpOptions
    );
  }
}
