import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { NewCampaign } from 'src/app/shared/models/campaign';

@Component({
  selector: 'app-organization-new-campaign',
  templateUrl: './organization-new-campaign.component.html',
  styleUrls: ['./organization-new-campaign.component.scss']
})
export class OrganizationNewCampaignComponent implements OnInit {
  form: FormGroup;
  
  alertError: any = "";
  alertSuccess: any = "";

  campaignStatus: any = [];

  constructor(
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createForm(new NewCampaign());
    this.getCampaignStatus();
  }

  public createForm(campaign: NewCampaign) {
    this.form = this.formBuilder.group({
      userId: new FormControl(campaign.userId, Validators.required),
      title: new FormControl(campaign.title, Validators.required),
      description: new FormControl(campaign.description, Validators.required),
      startDate: new FormControl(campaign.startDate, Validators.required),
      endDate: new FormControl(campaign.endDate, Validators.required),
      status: new FormControl(campaign.status, Validators.required),
    })
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  private validateFields() {
    Object.keys(this.form.controls).forEach((key) => {
      if (
        this.getControl(key).value == "" ||
        this.getControl(key).value == null
      )
        this.getControl(key).markAsTouched();
    });
  }

  getCampaignStatus() {
    this.campaignStatus = [
      {
        id: CampaignStatus.Active,
        label: "Ativa"
      },
      {
        id: CampaignStatus.Completed,
        label: "Finalizada"
      },
      {
        id: CampaignStatus.Pending,
        label: "Cancelada"
      },
    ]
  }

}
