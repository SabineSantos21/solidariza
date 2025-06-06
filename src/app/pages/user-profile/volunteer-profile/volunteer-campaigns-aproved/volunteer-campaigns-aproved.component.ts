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
    private readonly spinner: NgxSpinnerService,
    private readonly campaignsVolunteerService: CampaignVolunteerService
  ) { }

  ngOnInit(): void {
    this.getCampaignsVolunteerByUserIdAndAproved(this.profile.userId);
  }

  getCampaignsVolunteerByUserIdAndAproved(userId) {
    this.spinner.show();

    this.campaignsVolunteerService.getCampaignVolunteerByUserIdAndAproved(userId).subscribe(
      data => {
        this.campaigns = data;
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

}
