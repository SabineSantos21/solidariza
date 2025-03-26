import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignVolunteerViewComponent } from './campaign-volunteer-view.component';

describe('CampaignVolunteerViewComponent', () => {
  let component: CampaignVolunteerViewComponent;
  let fixture: ComponentFixture<CampaignVolunteerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
