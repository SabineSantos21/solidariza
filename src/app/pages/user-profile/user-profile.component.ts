import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/enums/userType';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  userId: any;
  user: any = null;
  profile: any = null;
  campaigns: any = [];

  showEditUser: boolean = false;

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly localStorageService: LocalStorageService,
    private readonly profileService: ProfileService,
    private readonly campaignService: CampaignService,
    private readonly route: ActivatedRoute,
    public router: Router,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get("id");
    this.user = this.localStorageService.get("user");

    if(this.userId ) {
      if(this.userId == this.user.userId) {
        this.showEditUser = true;
      }
      else {
        this.showEditUser = false;
      }

      this.getUserById(this.userId)
      this.getProfileByUserId(this.userId);
    }
    else if(this.user) {
      this.showEditUser = true;
      this.getProfileByUserId(this.user.userId);
    }
    else {
      this.router.navigate(['/login'])
    }
  }

  getProfileByUserId(userId){
    this.spinner.show();

    this.profileService.getProfileByUserId(userId).subscribe(
      data => {
        this.profile = data;

        if(this.user.type == UserType.Organization) {
          this.getCampaignByUserId(this.user.userId);
        }
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  getUserById(userId){
    this.spinner.show();

    this.userService.getUserById(userId).subscribe(
      data => {
        this.user = data;

        if(this.user.type == UserType.Organization) {
          this.getCampaignByUserId(this.user.userId);
        }
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
      }
    ).add(() => {
      this.spinner.hide();
    })
  }
}
