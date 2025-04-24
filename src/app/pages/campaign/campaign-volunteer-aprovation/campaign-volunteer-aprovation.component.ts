import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-campaign-volunteer-aprovation',
  templateUrl: './campaign-volunteer-aprovation.component.html',
  styleUrls: ['./campaign-volunteer-aprovation.component.scss']
})
export class CampaignVolunteerAprovationComponent implements OnInit {
  user: any = null;
  campaigns: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private campaignService: CampaignService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.localStorageService.get("user")

    if(!this.user) this.router.navigate(['/login'])

    this.getCampaigns(this.user.userId);
  }

  getCampaigns(userId) {
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
