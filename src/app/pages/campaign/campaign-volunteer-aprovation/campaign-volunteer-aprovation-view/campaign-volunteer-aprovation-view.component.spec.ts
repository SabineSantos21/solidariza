import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignVolunteerAprovationViewComponent } from './campaign-volunteer-aprovation-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { of } from 'rxjs';

describe('CampaignVolunteerAprovationViewComponent', () => {
  let component: CampaignVolunteerAprovationViewComponent;
  let fixture: ComponentFixture<CampaignVolunteerAprovationViewComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let campaignVolunteerServiceSpy: jasmine.SpyObj<CampaignVolunteerService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    campaignVolunteerServiceSpy = jasmine.createSpyObj('CampaignVolunteerService', [
      'getCampaignVolunteerByCampaignId',
      'updateCampaignVolunteer'
    ]);

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerAprovationViewComponent ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: CampaignVolunteerService, useValue: campaignVolunteerServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerAprovationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar os voluntários ao inicializar se houver campaignId', fakeAsync(() => {
    const volunteerMock = [{ id: 1, name: 'Voluntário 1' }];
    campaignVolunteerServiceSpy.getCampaignVolunteerByCampaignId.and.returnValue(of(volunteerMock));

    component.ngOnInit();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignVolunteerServiceSpy.getCampaignVolunteerByCampaignId).toHaveBeenCalledWith('1');
    expect(component.campaignsVolunteer).toEqual(volunteerMock);
    expect(component.change).toBeFalse();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve redirecionar se não houver campaignId', () => {
    activatedRouteMock.snapshot.paramMap.get = () => null;
    fixture = TestBed.createComponent(CampaignVolunteerAprovationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/campaign-volunteer-aprovation']);
  });

  it('getCampaignsVolunteerByCampaignId deve atualizar a lista', fakeAsync(() => {
    const volunteerMock = [{ id: 2, name: 'Outro Voluntário' }];
    campaignVolunteerServiceSpy.getCampaignVolunteerByCampaignId.and.returnValue(of(volunteerMock));
    
    component.getCampaignsVolunteerByCampaignId('1');
    tick();

    expect(component.campaignsVolunteer).toEqual(volunteerMock);
    expect(component.change).toBeFalse();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('updateCampaignsVolunteer deve chamar serviço e atualizar lista', fakeAsync(() => {
    component.campaignId = '15';
    campaignVolunteerServiceSpy.updateCampaignVolunteer.and.returnValue(of({}));
    campaignVolunteerServiceSpy.getCampaignVolunteerByCampaignId.and.returnValue(of([]));

    component.updateCampaignsVolunteer(true, 'volId');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignVolunteerServiceSpy.updateCampaignVolunteer)
      .toHaveBeenCalledWith('volId', { isApproved: true });
    expect(campaignVolunteerServiceSpy.getCampaignVolunteerByCampaignId)
      .toHaveBeenCalledWith('15');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});