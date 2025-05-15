import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-campaign',
  templateUrl: './organization-campaign.component.html',
  styleUrls: ['./organization-campaign.component.scss']
})
export class OrganizationCampaignComponent {
  @Input() campaign: any;
  @Input() profile: any;
  @Input() showEditUser: any;
  
  constructor() { }

}
