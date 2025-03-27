import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerCampaignsAprovedComponent } from './volunteer-campaigns-aproved.component';

describe('VolunteerCampaignsAprovedComponent', () => {
  let component: VolunteerCampaignsAprovedComponent;
  let fixture: ComponentFixture<VolunteerCampaignsAprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolunteerCampaignsAprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerCampaignsAprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
