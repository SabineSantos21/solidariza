import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-campaign-volunteer',
  templateUrl: './campaign-volunteer.component.html',
})
export class CampaignVolunteerComponent implements OnInit {
  volunteer: any = null;

  campaignId: any = null;
  campaign: any = null;

  created: any = null;

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    private readonly route: ActivatedRoute,
    public localStorageService: LocalStorageService,
    public campaignVolunteerService: CampaignVolunteerService,
    public campaignService: CampaignService
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");  

    if(this.campaignId) {
      this.volunteer = this.localStorageService.get("user");

      if (!this.volunteer) {
        this.router.navigate(["/"]);
        return;
      }

      this.createCampaignVolunteer();
    }
    else {
      this.router.navigate(["/dashboard"]);
    }
  }

  getCampaignById() {
    this.spinner.show();

    this.campaignService.getCampaignById(this.campaignId).subscribe({
      next: (data) => {
        this.campaign = data;
      },
    }).add(() => {
      this.spinner.hide()
    })
  }

  createCampaignVolunteer() {
    this.spinner.show();

    let newCampaignVolunteer = {
      userId: this.volunteer.userId,
      campaignId: this.campaignId
    }

    this.campaignVolunteerService.createCampaignVolunteer(newCampaignVolunteer).subscribe({
      next: (data) => {
        this.created = true;
        this.getCampaignById();
      },
      error: () => {
        this.created = false;
      }
    }).add(() => {
      this.spinner.hide();
    })
  }

}
