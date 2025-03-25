import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignDonationComponent } from './campaign-donation.component';

describe('CampaignDonationComponent', () => {
  let component: CampaignDonationComponent;
  let fixture: ComponentFixture<CampaignDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignDonationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
