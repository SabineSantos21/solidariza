import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { CampaignType } from 'src/app/shared/enums/campaignType';
import { EditCampaign } from 'src/app/shared/models/campaign';
import { CampaignService } from 'src/app/shared/services/campaign.service';

@Component({
  selector: 'app-organization-edit-campaign',
  templateUrl: './organization-edit-campaign.component.html',
  styleUrls: ['./organization-edit-campaign.component.scss']
})
export class OrganizationEditCampaignComponent implements OnInit {
  form: FormGroup;

  alertError: any = "";
  alertSuccess: any = "";

  campaign: any;
  campaignId: string;
  campaignStatus: any = [];
  campaignType: any = [];

  constructor(
    public spinner: NgxSpinnerService,
    public formBuilder: FormBuilder,
    public campaignService: CampaignService,
    public router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");

    if(this.campaignId) {
      this.createForm(new EditCampaign());
      this.getCampaignStatus();    
      this.getCampaignType();
      this.getCampaignById(this.campaignId)
    } 
    else {
      this.router.navigate(["/user-profile"]);
    }
  }

  public createForm(campaign: EditCampaign) {
    this.form = this.formBuilder.group({
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

  fillFields(campaign) {
    this.form.setValue({
      title: campaign.title,
      description: campaign.description,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      type: campaign.type,
      address: campaign.address,
      state: campaign.state,
      city: campaign.city
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

  getCampaignById(campaignId) {
    this.spinner.show();
    
    this.campaignService.getCampaignById(campaignId).subscribe(
      data => {
        this.fillFields(data);
      },
      error => {
        this.alertError = "Erro ao buscar campanha"
      }
    ).add(() => {
      this.spinner.hide();
    })
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

  updateCampaign() {

    if(this.form.invalid) {
      this.validateFields();
    }
    else {
      this.spinner.show();
  
      this.campaignService.updateCampaign(this.campaignId, this.form.value).subscribe(
        (data) => {
          this.alertSuccess = "Alterações Salvas com sucesso"
        },
        (error) => {
          this.alertError = "Erro ao salvar alterações. Tente novamente."
        }
      ).add(() => {
        this.spinner.hide();
      })
    }

  }

  deleteCampaign(campaignId) {
    this.campaignService.deleteCampaign(campaignId).subscribe(
      date => {
        this.alertSuccess = "Campanha deletada com sucesso"
      }
    )
  }
}
