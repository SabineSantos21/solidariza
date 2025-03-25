import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './volunteer-profile.component.html',
  styleUrls: ['./volunteer-profile.component.scss']
})
export class VolunteerProfileComponent implements OnInit {
  @Input() user;
  @Input() profile;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
