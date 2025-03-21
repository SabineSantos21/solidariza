import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-campaign',
  templateUrl: './organization-campaign.component.html',
  styleUrls: ['./organization-campaign.component.scss']
})
export class OrganizationCampaignComponent implements OnInit {
  @Input() campaign: any;
  @Input() profile: any;

  constructor() { }

  ngOnInit(): void {
  }

}
