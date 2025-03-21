import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditCampaignComponent } from './organization-edit-campaign.component';

describe('OrganizationEditCampaignComponent', () => {
  let component: OrganizationEditCampaignComponent;
  let fixture: ComponentFixture<OrganizationEditCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationEditCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationEditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
