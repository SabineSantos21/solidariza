import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignVolunteerComponent } from './campaign-volunteer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { of, throwError } from 'rxjs';

describe('CampaignVolunteerComponent', () => {
  let component: CampaignVolunteerComponent;
  let fixture: ComponentFixture<CampaignVolunteerComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let campaignVolunteerServiceSpy: jasmine.SpyObj<CampaignVolunteerService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    campaignVolunteerServiceSpy = jasmine.createSpyObj('CampaignVolunteerService', ['createCampaignVolunteer']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignById']);

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '101'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ CampaignVolunteerComponent ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: CampaignVolunteerService, useValue: campaignVolunteerServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar volunteer e criar vínculo ao inicializar se houver campaignId', fakeAsync(() => {
    localStorageSpy.get.and.returnValue({ userId: 7, name: 'João' });
    const volunteerData = { userId: 7, campaignId: '101' };

    campaignVolunteerServiceSpy.createCampaignVolunteer.and.returnValue(of({}));
    campaignServiceSpy.getCampaignById.and.returnValue(of({ id: '101', nome: 'Teste' }));

    component.ngOnInit();
    tick();

    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignVolunteerServiceSpy.createCampaignVolunteer)
      .toHaveBeenCalledWith(volunteerData);
    expect(component.created).toBeTrue();
    expect(component.campaign).toBeTruthy();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve redirecionar se não houver campaignId', () => {
    activatedRouteMock.snapshot.paramMap.get = () => null;
    fixture = TestBed.createComponent(CampaignVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve definir created como false ao falhar ao criar o vínculo', fakeAsync(() => {
    localStorageSpy.get.and.returnValue({ userId: 7 });
    campaignVolunteerServiceSpy.createCampaignVolunteer.and.returnValue(
      throwError(() => new Error('Erro ao criar vínculo'))
    );
    component.ngOnInit();
    tick();

    expect(component.created).toBeFalse();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignById busca detalhes da campanha', fakeAsync(() => {
    component.campaignId = '101';
    const campaignMock = { id: '101', nome: 'Teste' };
    campaignServiceSpy.getCampaignById.and.returnValue(of(campaignMock));

    component.getCampaignById();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignById).toHaveBeenCalledWith('101');
    expect(component.campaign).toEqual(campaignMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignById apenas oculta o spinner em caso de erro', fakeAsync(() => {
    component.campaignId = '101';
    campaignServiceSpy.getCampaignById.and.returnValue(throwError(() => new Error('Falha')));
    component.getCampaignById();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));
});