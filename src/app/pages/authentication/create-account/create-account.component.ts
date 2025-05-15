import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
  formShow = 'options'

  constructor() { }

  showForm(value) {
    this.formShow = value;
  }

}
