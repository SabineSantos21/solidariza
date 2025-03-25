import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ProfileEditComponent } from 'src/app/pages/user-profile/profile-edit/profile-edit.component';
import { OrganizationNewCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-new-campaign/organization-new-campaign.component';
import { OrganizationEditCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-edit-campaign/organization-edit-campaign.component';
import { CampaignViewComponent } from 'src/app/pages/campaign/campaign-view/campaign-view.component';
import { CampaignVolunteerComponent } from 'src/app/pages/campaign/campaign-volunteer/campaign-volunteer.component';
import { CampaignDonationComponent } from 'src/app/pages/campaign/campaign-donation/campaign-donation.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'profile-edit',   component: ProfileEditComponent },
    { path: 'new-campaign',   component: OrganizationNewCampaignComponent },
    { path: 'edit-campaign',   component: OrganizationEditCampaignComponent },
    { path: 'campaign-view',   component: CampaignViewComponent },
    { path: 'campaign-volunter',   component: CampaignVolunteerComponent },
    { path: 'campaign-donation',   component: CampaignDonationComponent },
];
