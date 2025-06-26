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
export class OrganizationInfoService {

  constructor(private readonly http: HttpClient) { }

  createOrganizationInfo(organizationInfo): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}OrganizationInfo`,
      organizationInfo,
      httpOptions
    );
  }

  updateOrganizationInfo(organizationInfoId, organizationInfo): Observable<any> {
    return this.http.put(
      `${environment.apiAddress}OrganizationInfo/${organizationInfoId}`,
      organizationInfo,
      httpOptions
    );
  }

  getOrganizationInfoById(organizationInfoId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}OrganizationInfo/${organizationInfoId}`,
      httpOptions
    );
  }
  
  getOrganizationInfoByUserId(userId): Observable<any> {
    return this.http.get(
      `${environment.apiAddress}OrganizationInfo/Organization/${userId}`,
      httpOptions
    );
  }

  deleteOrganizationInfo(organizationInfoId): Observable<any> {
    return this.http.delete(
      `${environment.apiAddress}OrganizationInfo/${organizationInfoId}`,
      httpOptions
    );
  }

  organizationInfoValidateByOrganizationInfoId(organizationInfoId, cnpj): Observable<any> {
    return this.http.post(
      `${environment.apiAddress}OrganizationInfo/Validade/${organizationInfoId}/${cnpj}`,
      httpOptions
    );
  }
}
