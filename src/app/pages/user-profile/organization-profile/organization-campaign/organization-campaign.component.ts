import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-campaign',
  templateUrl: './organization-campaign.component.html',
})
export class OrganizationCampaignComponent {
  @Input() campaign: any;
  @Input() profile: any;
  @Input() showEditUser: any;
  
  constructor() { }

}
