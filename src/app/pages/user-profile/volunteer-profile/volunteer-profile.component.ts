import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-volunteer-profile',
  templateUrl: './volunteer-profile.component.html',
})
export class VolunteerProfileComponent {
  @Input() user;
  @Input() profile;

  constructor(
  ) { }

}
