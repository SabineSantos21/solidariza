import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  profile: any = null;
  campaigns: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private profileService: ProfileService,
    private campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.user = this.localStorageService.get("user");

    if(this.user) {
      this.getProfileByUserId(this.user.userId)
    }
  }

  getProfileByUserId(userId){
    this.spinner.show();

    this.profileService.getProfileByUserId(userId).subscribe(
      data => {
        this.profile = data;
      },
      error => {
        
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  getCampaignByUserId(userId) {
    this.spinner.show();

    this.campaignService.getCampaignByUserId(userId).subscribe(
      data => {
        this.campaigns = data;
      },
      error => {

      }
    ).add(() => {
      this.spinner.hide();
    })
  }
}
