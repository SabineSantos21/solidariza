import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/enums/userType';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  user: any = [];
  campaigns: any = [];
  campaignsList: any = [];
  search: any;

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly localStorageService: LocalStorageService,
    private readonly campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.user = this.localStorageService.get("user");

    if(this.user) {

      if(this.user.type == UserType.Organization) {
        this.getCampaignByUserId(this.user.userId);
      }
      else {
        this.getCampaigns();
      }

    }
  }

  getCampaignByUserId(userId) {
    this.spinner.show();

    this.campaignService.getCampaignByUserId(userId).subscribe(
      data => {
        this.campaigns = data;
        this.campaignsList = data;
      },
      error => {

      }
    ).add(() => {
      this.spinner.hide();
    })
  }
  
  getCampaigns() {
    this.spinner.show();

    this.campaignService.getCampaigns().subscribe(
      data => {
        this.campaigns = data;
        this.campaignsList = data;
      },
      error => {

      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  filterCampaigns() {
    this.campaignsList = this.filterByUserName(this.campaigns, this.search);
  }

  filterByUserName(campaigns: any[], name: string): any[] {
    return campaigns.filter(campaign => 
      campaign.user?.name?.toLowerCase().includes(name.toLowerCase())
    );
  }
  
}
