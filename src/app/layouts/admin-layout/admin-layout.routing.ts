import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ProfileEditComponent } from 'src/app/pages/user-profile/profile-edit/profile-edit.component';
import { OrganizationNewCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-new-campaign/organization-new-campaign.component';
import { OrganizationEditCampaignComponent } from 'src/app/pages/user-profile/organization-profile/organization-edit-campaign/organization-edit-campaign.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'profile-edit',   component: ProfileEditComponent },
    { path: 'new-campaign',   component: OrganizationNewCampaignComponent },
    { path: 'edit-campaign',   component: OrganizationEditCampaignComponent },
];
