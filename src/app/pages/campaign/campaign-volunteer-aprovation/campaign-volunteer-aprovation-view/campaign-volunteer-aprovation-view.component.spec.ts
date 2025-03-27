import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignVolunteerAprovationViewComponent } from './campaign-volunteer-aprovation-view.component';

describe('CampaignVolunteerAprovationViewComponent', () => {
  let component: CampaignVolunteerAprovationViewComponent;
  let fixture: ComponentFixture<CampaignVolunteerAprovationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerAprovationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerAprovationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
