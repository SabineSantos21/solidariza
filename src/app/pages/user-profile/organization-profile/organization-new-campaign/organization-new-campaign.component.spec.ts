import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationNewCampaignComponent } from './organization-new-campaign.component';

describe('OrganizationNewCampaignComponent', () => {
  let component: OrganizationNewCampaignComponent;
  let fixture: ComponentFixture<OrganizationNewCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationNewCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationNewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
