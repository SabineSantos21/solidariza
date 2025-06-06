import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { CampaignType } from 'src/app/shared/enums/campaignType';
import { EditCampaign } from 'src/app/shared/models/campaign';
import { CampaignService } from 'src/app/shared/services/campaign.service';

const CAMPAIGN_STATUS_OPTIONS = [
  { id: CampaignStatus.Active, label: "Ativa" },
  { id: CampaignStatus.Completed, label: "Finalizada" },
  { id: CampaignStatus.Pending, label: "Cancelada" },
];

const CAMPAIGN_TYPE_OPTIONS = [
  { id: CampaignType.Collection, label: "Arrecadação" },
  { id: CampaignType.In_Person, label: "Presencial" }
];

@Component({
  selector: 'app-organization-edit-campaign',
  templateUrl: './organization-edit-campaign.component.html',
})
export class OrganizationEditCampaignComponent implements OnInit {
  form: FormGroup;

  alertError = "";
  alertSuccess = "";

  campaignId: string;
  campaignStatus = CAMPAIGN_STATUS_OPTIONS;
  campaignType = CAMPAIGN_TYPE_OPTIONS;

  constructor(
    public spinner: NgxSpinnerService,
    public formBuilder: FormBuilder,
    public campaignService: CampaignService,
    public router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");
    if (this.campaignId) {
      this.createForm(new EditCampaign());
      this.getCampaignById(this.campaignId);
    } else {
      this.router.navigate(["/user-profile"]);
    }
  }

  public createForm(campaign: EditCampaign) {
    this.form = this.formBuilder.group({
      title: [campaign.title, Validators.required],
      description: [campaign.description, Validators.required],
      startDate: [campaign.startDate, Validators.required],
      endDate: [campaign.endDate, Validators.required],
      status: [campaign.status, Validators.required],
      type: [campaign.type, Validators.required],
      address: [campaign.address],
      state: [campaign.state],
      city: [campaign.city]
    });
  }

  fillFields(campaign) {
    this.form.patchValue({ ...campaign });
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  private validateFields() {
    Object.values(this.form.controls).forEach(control => {
      if (control.value == "" || control.value == null) control.markAsTouched();
    });
  }

  private handleAsync(obs, onSuccess, onError) {
    this.spinner.show();
    obs.subscribe(
      onSuccess,
      err => { if (onError) { onError(err); } }
    ).add(() => this.spinner.hide());
  }

  getCampaignById(campaignId) {
    this.handleAsync(
      this.campaignService.getCampaignById(campaignId),
      data => this.fillFields(data),
      () => { this.alertError = "Erro ao buscar campanha"; }
    );
  }

  updateCampaign() {
    if (this.form.invalid) {
      this.validateFields();
    } else {
      this.handleAsync(
        this.campaignService.updateCampaign(this.campaignId, this.form.value),
        () => { this.alertSuccess = "Alterações salvas com sucesso!"; },
        () => { this.alertError = "Erro ao salvar alterações. Tente novamente."; }
      );
    }
  }

  deleteCampaign(campaignId) {
    this.campaignService.deleteCampaign(campaignId).subscribe(
      () => { this.alertSuccess = "Campanha deletada com sucesso"; }
    );
  }
}