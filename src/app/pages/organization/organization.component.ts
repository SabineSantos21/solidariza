import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  organizations: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getOrganizations()
  }

  getOrganizations() {
    this.spinner.show();

    this.profileService.getProfileOrganization().subscribe(
      data => {
        this.organizations = data;

        console.log(this.organizations)
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

}
