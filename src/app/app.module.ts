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
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    CreateAccountComponent,
    OrganizationComponent,
    DonorComponent,
    VolunteerComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
