import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/enums/userType';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any = [];
  campaigns: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.user = this.localStorageService.get("user");

    if(this.user) {

      if(this.user.type == UserType.Organization) {
        this.getCampaignByUserId(this.user.userId);
      }

    }
  }

  getCampaignByUserId(userId) {
    this.spinner.show();

    this.campaignService.getCampaignByUserId(userId).subscribe(
      data => {
        this.campaigns = data;

        console.log(this.campaigns)
      },
      error => {

      }
    ).add(() => {
      this.spinner.hide();
    })
  }
}
