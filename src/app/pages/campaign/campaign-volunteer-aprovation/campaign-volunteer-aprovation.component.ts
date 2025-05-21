import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-campaign-volunteer-aprovation',
  templateUrl: './campaign-volunteer-aprovation.component.html',
})
export class CampaignVolunteerAprovationComponent implements OnInit {
  user: any = null;
  campaigns: any = [];

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly campaignService: CampaignService,
    private readonly localStorageService: LocalStorageService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.localStorageService.get("user")

    if(!this.user) this.router.navigate(['/login'])

    this.getCampaigns(this.user?.userId);
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
