import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES_ORGANIZATION, ROUTES_VOLUNTEER } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserType } from 'src/app/shared/enums/userType';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router, private localStorageService: LocalStorageService) {
    this.location = location;
  }
  public user;

  ngOnInit() {
    this.user = this.localStorageService.get("user")

    if(this.user.type == UserType.Organization) {
      this.listTitles = ROUTES_ORGANIZATION.filter(menuItem => menuItem);
    }
    else if(this.user.type == UserType.Donor) {
      this.listTitles = ROUTES_VOLUNTEER.filter(menuItem => menuItem);
    }
    else if(this.user.type == UserType.Volunteer) {
      this.listTitles = ROUTES_VOLUNTEER.filter(menuItem => menuItem);
    }
    else {
      this.router.navigate(['/login'])
    }

  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

}
