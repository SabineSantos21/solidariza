import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent implements OnInit {
  campaignId: string;
  campaign: any = null;

  user: any = null;

  alertError: any = "";
  alertSuccess: any = "";

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    private readonly route: ActivatedRoute,
    public campaignService: CampaignService,
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");

    if(this.campaignId) {
      this.user = this.localStorageService.get("user");
      this.getCampaignById(this.campaignId);
    }
    else {
      this.router.navigate(["/dashboard"]);
    }
  }

  getCampaignById(campaignId) {
    this.spinner.show();
    
    this.campaignService.getCampaignById(campaignId).subscribe(
      data => {
        this.campaign = data;
      },
      error => {
        this.alertError = "Erro ao buscar campanha"
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

}
