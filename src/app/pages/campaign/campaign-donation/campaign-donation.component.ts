import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaign-donation',
  templateUrl: './campaign-donation.component.html',
  styleUrls: ['./campaign-donation.component.scss']
})
export class CampaignDonationComponent implements OnInit {
  qrCode: any;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
