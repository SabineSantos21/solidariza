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
export class DonationService {

  constructor(private http: HttpClient) { }

  getDonationQRCode(donationInfo): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}/Donation/QRCode`,
      donationInfo,
      httpOptions
    );
  }
}
