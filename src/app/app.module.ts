import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CreateAccountComponent } from './pages/authentication/create-account/create-account.component';
import { OrganizationComponent } from './pages/authentication/create-account/organization/organization.component';
import { DonorComponent } from './pages/authentication/create-account/donor/donor.component';
import { VolunteerComponent } from './pages/authentication/create-account/volunteer/volunteer.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { OrganizationProfileComponent } from './pages/user-profile/organization-profile/organization-profile.component';
import { VolunteerProfileComponent } from './pages/user-profile/volunteer-profile/volunteer-profile.component';
import { DonorProfileComponent } from './pages/user-profile/donor-profile/donor-profile.component';

const maskConfig: Partial<IConfig> = {
  validation: false, // Define se a máscara deve validar o input
};

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfig)
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    CreateAccountComponent,
    OrganizationComponent,
    DonorComponent,
    VolunteerComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
