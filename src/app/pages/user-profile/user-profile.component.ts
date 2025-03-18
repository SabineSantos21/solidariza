import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  profile: any = null;

  constructor(
    private localStorageService: LocalStorageService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.user = this.localStorageService.get("user");

    if(this.user) {
      this.getProfileByUserId(this.user.userId)
    }
  }

  getProfileByUserId(userId){
    this.profileService.getProfileByUserId(userId).subscribe(
      data => {
        this.profile = data;
      },
      error => {
        
      }
    )
  }

}
