import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignVolunteerAprovationComponent } from './campaign-volunteer-aprovation.component';

describe('CampaignVolunteerAprovationComponent', () => {
  let component: CampaignVolunteerAprovationComponent;
  let fixture: ComponentFixture<CampaignVolunteerAprovationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerAprovationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerAprovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
