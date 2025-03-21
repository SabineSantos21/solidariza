import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  user: any;
  profile: any;

  alertError: any = "";
  alertSuccess: any = "";

  loading = false

  constructor(
    private spinner: NgxSpinnerService,
    public profileService: ProfileService,
    public localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getProfileByUserId(userId) {
    this.spinner.show();

    this.profileService.getProfileByUserId(userId).subscribe(
      data => {
        this.profile = data;
      }
    ).add(() => {
      this.loading = true;
      this.spinner.hide();
    })
  }

  getUser() {
    this.user = this.localStorageService.get("user");
    this.getProfileByUserId(this.user.userId);
  }  
}
