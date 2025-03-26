import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerStatus } from 'src/app/shared/enums/campaignVolunteerStatus';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-campaign-volunteer-view',
  templateUrl: './campaign-volunteer-view.component.html',
  styleUrls: ['./campaign-volunteer-view.component.scss']
})
export class CampaignVolunteerViewComponent implements OnInit {
  user: any = null;
  campaignsVolunteer: any = [];

  constructor(
    private spinner: NgxSpinnerService,
    private campaignVolunteerService: CampaignVolunteerService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.user = this.localStorageService.get("user");

    if(this.user) {
      this.getCampaignVolunteersByUserId(this.user.userId);
    }
  }

  getCampaignVolunteersByUserId(userId) {
    this.spinner.show();

    this.campaignVolunteerService.getCampaignVolunteerByUserId(userId).subscribe(
      data => {
        this.campaignsVolunteer = data;

        this.campaignsVolunteer.map(c => {
          c.status = this.getStatus(c.isApproved)
        })
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  getStatus(status) {
    switch (status) {
      case CampaignVolunteerStatus.APROVED:
        return {
          label: "Aprovado",
          color: "text-success"
        }
        
      case CampaignVolunteerStatus.NOT_APROVED:
        return {
          label: "Não Aprovado",
          color: "text-danger"
        }
      
      case CampaignVolunteerStatus.PENDING:
        return {
          label: "Aguardando Aprovação",
          color: "text-default"
        }
    }
  }

}
