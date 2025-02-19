import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  formShow = 'organization'

  constructor() { }

  ngOnInit(): void {
  }

  showForm(value) {
    this.formShow = value;
  }

}
