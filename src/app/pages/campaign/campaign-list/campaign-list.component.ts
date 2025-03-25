import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  @Input() campaign;
  @Input() profile;

  constructor() { }

  ngOnInit(): void {
  }

}
