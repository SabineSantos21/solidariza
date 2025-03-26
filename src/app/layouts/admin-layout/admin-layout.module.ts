import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VolunteerProfileComponent } from 'src/app/pages/user-profile/volunteer-profile/volunteer-profile.component';
import { OrganizationProfileComponent } from 'src/app/pages/user-profile/organization-profile/organization-profile.component';
import { ProfileEditComponent } from 'src/app/pages/user-profile/profile-edit/profile-edit.component';
import { OrganizationEditComponent } from 'src/app/pages/user-profile/profile-edit/organization-edit/organization-edit.component';
import { VolunteerEditComponent } from 'src/app/pages/user-profile/profile-edit/volunteer-edit/volunteer-edit.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { OrganizationCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-campaign/organization-campaign.component';
import { OrganizationNewCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-new-campaign/organization-new-campaign.component';
import { OrganizationEditCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-edit-campaign/organization-edit-campaign.component';
import { CampaignViewComponent } from 'src/app/pages/campaign/campaign-view/campaign-view.component';
import { CampaignVolunteerComponent } from 'src/app/pages/campaign/campaign-volunteer/campaign-volunteer.component';
import { CampaignListComponent } from 'src/app/pages/campaign/campaign-list/campaign-list.component';
import { CampaignDonationComponent } from 'src/app/pages/campaign/campaign-donation/campaign-donation.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
// import { ToastrModule } from 'ngx-toastr';

const maskConfig: Partial<IConfig> = {
  validation: false, // Define se a máscara deve validar o input
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfig)
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    VolunteerProfileComponent,
    OrganizationProfileComponent,
    ProfileEditComponent,
    OrganizationEditComponent,
    VolunteerEditComponent,
    OrganizationCampaignComponent,
    OrganizationNewCampaignComponent,
    OrganizationEditCampaignComponent,
    CampaignViewComponent,
    CampaignVolunteerComponent,
    CampaignListComponent,
    CampaignDonationComponent,
    ProfileComponent,
  ]
})

export class AdminLayoutModule {}
