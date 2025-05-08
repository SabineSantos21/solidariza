import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolunteerCampaignsAprovedComponent } from './volunteer-campaigns-aproved.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VolunteerCampaignsAprovedComponent', () => {
  let component: VolunteerCampaignsAprovedComponent;
  let fixture: ComponentFixture<VolunteerCampaignsAprovedComponent>;
  let mockSpinner: any;
  let mockCampaignVolunteerService: any;

  beforeEach(async () => {
    mockSpinner = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    mockCampaignVolunteerService = {
      getCampaignVolunteerByUserIdAndAproved: jasmine.createSpy('getCampaignVolunteerByUserIdAndAproved')
        .and.returnValue(of([{ id: 1, name: 'Campanha Teste' }]))
    };

    await TestBed.configureTestingModule({
      declarations: [VolunteerCampaignsAprovedComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: CampaignVolunteerService, useValue: mockCampaignVolunteerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerCampaignsAprovedComponent);
    component = fixture.componentInstance;
    component.profile = { userId: 99 };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getCampaignsVolunteerByUserIdAndAproved com userId ao inicializar', () => {
    spyOn(component, 'getCampaignsVolunteerByUserIdAndAproved').and.callThrough();
    component.ngOnInit();
    expect(component.getCampaignsVolunteerByUserIdAndAproved).toHaveBeenCalledWith(99);
  });

  it('deve popular campaigns ao buscar campanhas aprovadas', () => {
    component.getCampaignsVolunteerByUserIdAndAproved(77);
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockCampaignVolunteerService.getCampaignVolunteerByUserIdAndAproved).toHaveBeenCalledWith(77);
    expect(component.campaigns.length).toBe(1);
    expect(component.campaigns[0].name).toBe('Campanha Teste');
    expect(mockSpinner.hide).toHaveBeenCalled();
  });

});