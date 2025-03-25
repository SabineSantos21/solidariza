import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { CampaignType } from 'src/app/shared/enums/campaignType';
import { NewCampaign } from 'src/app/shared/models/campaign';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

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
  campaignType: any = [];
  user: any;

  constructor(
    public spinner: NgxSpinnerService,
    public formBuilder: FormBuilder,
    public campaignService: CampaignService,
    public localStorageService: LocalStorageService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.createForm(new NewCampaign());
    this.getCampaignStatus();
    this.getCampaignType();
    this.getUser();
  }

  public createForm(campaign: NewCampaign) {
    this.form = this.formBuilder.group({
      userId: new FormControl(campaign.userId, Validators.required),
      title: new FormControl(campaign.title, Validators.required),
      description: new FormControl(campaign.description, Validators.required),
      startDate: new FormControl(campaign.startDate, Validators.required),
      endDate: new FormControl(campaign.endDate, Validators.required),
      status: new FormControl(campaign.status, Validators.required),
      type: new FormControl(campaign.type, Validators.required),
      address: new FormControl(campaign.address,null),
      state: new FormControl(campaign.state,null),
      city: new FormControl(campaign.city,null)
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

  getCampaignType() {
    this.campaignType = [
      {
        id: CampaignType.Collection,
        label: "Arrecadação"
      },
      {
        id: CampaignType.In_Person,
        label: "Presencial"
      }
    ]
  }

  getUser() {
    this.user = this.localStorageService.get("user");
  }

  createCampaign() {
    
    this.getControl("userId").setValue(this.user.userId);
    console.log(this.form)

    if(this.form.invalid){
      this.validateFields()
    }
    else {
      this.spinner.show();
      
      this.campaignService.createCampaign(this.form.value).subscribe(
        (data) => {
          this.alertSuccess = "Campanha criada com sucesso"
          this.router.navigate(["/user-profile"])
          
        },
        (error) => {
          this.alertError = "Erro ao criar campanha. Tente novamente mais tarde."
        }
      ).add(() => {
        this.spinner.hide();
      })

    }
  }

}
