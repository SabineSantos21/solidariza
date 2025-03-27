import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';

@Component({
  selector: 'app-volunteer-campaigns-aproved',
  templateUrl: './volunteer-campaigns-aproved.component.html',
  styleUrls: ['./volunteer-campaigns-aproved.component.scss']
})
export class VolunteerCampaignsAprovedComponent implements OnInit {
  @Input() profile: any;
  campaigns: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private campaignsVolunteerService: CampaignVolunteerService
  ) { }

  ngOnInit(): void {
    console.log(this.profile)
    this.getCampaignsVolunteerByUserIdAndAproved(this.profile.userId);
  }

  getCampaignsVolunteerByUserIdAndAproved(userId) {
    this.spinner.show();

    this.campaignsVolunteerService.getCampaignVolunteerByUserIdAndAproved(userId).subscribe(
      data => {
        this.campaigns = data;

        console.log(this.campaigns);
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

}
