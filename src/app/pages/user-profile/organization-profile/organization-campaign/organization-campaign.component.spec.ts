import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCampaignComponent } from './organization-campaign.component';

describe('OrganizationCampaignComponent', () => {
  let component: OrganizationCampaignComponent;
  let fixture: ComponentFixture<OrganizationCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
