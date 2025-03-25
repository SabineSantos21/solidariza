import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignVolunteerComponent } from './campaign-volunteer.component';

describe('CampaignVolunteerComponent', () => {
  let component: CampaignVolunteerComponent;
  let fixture: ComponentFixture<CampaignVolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
