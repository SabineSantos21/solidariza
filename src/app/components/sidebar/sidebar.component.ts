import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from 'src/app/shared/enums/userType';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES_ORGANIZATION: RouteInfo[] = [
    { path: '/dashboard', title: 'Minhas Campanhas',  icon: 'ni-app text-orange', class: '' },
    { path: '/icons', title: 'Instituições',  icon:'ni-favourite-28 text-blue', class: '' }
];

export const ROUTES_VOLUNTEER: RouteInfo[] = [
    { path: '/dashboard', title: 'Campanhas',  icon: 'ni-app text-orange', class: '' },
    { path: '/icons', title: 'Instituições',  icon:'ni-favourite-28 text-blue', class: '' },
];

export const ROUTES_DONOR: RouteInfo[] = [
    { path: '/dashboard', title: 'Campanhas',  icon: 'ni-app text-orange', class: '' },
    { path: '/icons', title: 'Instituições',  icon:'ni-favourite-28 text-blue', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  user: any;

  constructor(private router: Router, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.user = this.localStorageService.get("user")

    if(this.user.type == UserType.Organization) {
      this.menuItems = ROUTES_ORGANIZATION.filter(menuItem => menuItem);
    }
    else if(this.user.type == UserType.Donor) {
      this.menuItems = ROUTES_VOLUNTEER.filter(menuItem => menuItem);
    }
    else if(this.user.type == UserType.Volunteer) {
      this.menuItems = ROUTES_VOLUNTEER.filter(menuItem => menuItem);
    }
    else {
      this.router.navigate(['/login'])
    }

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });

  }
}
