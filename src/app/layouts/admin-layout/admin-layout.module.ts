import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VolunteerProfileComponent } from 'src/app/pages/user-profile/volunteer-profile/volunteer-profile.component';
import { OrganizationProfileComponent } from 'src/app/pages/user-profile/organization-profile/organization-profile.component';
import { ProfileEditComponent } from 'src/app/pages/user-profile/profile-edit/profile-edit.component';
import { OrganizationEditComponent } from 'src/app/pages/user-profile/profile-edit/organization-edit/organization-edit.component';
import { VolunteerEditComponent } from 'src/app/pages/user-profile/profile-edit/volunteer-edit/volunteer-edit.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    VolunteerProfileComponent,
    OrganizationProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    ProfileEditComponent,
    OrganizationEditComponent,
    VolunteerEditComponent,
  ]
})

export class AdminLayoutModule {}
