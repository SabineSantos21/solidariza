import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';

@Component({
  selector: 'app-campaign-volunteer-aprovation-view',
  templateUrl: './campaign-volunteer-aprovation-view.component.html',
})
export class CampaignVolunteerAprovationViewComponent implements OnInit {
  campaignId: string;
  
  user: any = null;
  campaignsVolunteer: any = [];
  change: boolean = false;

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly campaignVolunteerService: CampaignVolunteerService,    
    private readonly route: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");

    if(this.campaignId) {
      this.getCampaignsVolunteerByCampaignId(this.campaignId);
    }
    else {
      this.router.navigate(["/campaign-volunteer-aprovation"]);
    }
  }
  

  getCampaignsVolunteerByCampaignId(campaignId) {
    this.spinner.show();

    this.campaignVolunteerService.getCampaignVolunteerByCampaignId(campaignId).subscribe(
      data => {
        this.campaignsVolunteer = data;
        this.change = false;        
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  updateCampaignsVolunteer(value, campaignsVolunteerId) {
    this.spinner.show();

    let updateCampaignVolunteer = {
      isApproved : value
    }

    this.campaignVolunteerService.updateCampaignVolunteer(campaignsVolunteerId, updateCampaignVolunteer).subscribe(
      data => {
        this.getCampaignsVolunteerByCampaignId(this.campaignId);
      }
    ).add(() => {
      this.spinner.hide();
    })

  }

}
