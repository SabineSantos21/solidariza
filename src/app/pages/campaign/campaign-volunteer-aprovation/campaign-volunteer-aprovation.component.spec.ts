import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignVolunteerAprovationComponent } from './campaign-volunteer-aprovation.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('CampaignVolunteerAprovationComponent', () => {
  let component: CampaignVolunteerAprovationComponent;
  let fixture: ComponentFixture<CampaignVolunteerAprovationComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignByUserId']);
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of([])); // <- Retorno padrão!
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    localStorageSpy.get.and.returnValue({ userId: 1, name: 'default' }); // <- Retorno padrão!
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [CampaignVolunteerAprovationComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerAprovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar usuário do localStorage no ngOnInit', () => {
    localStorageSpy.get.and.returnValue({ userId: 200, name: 'Gestor(a)' });
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of([]));

    component.ngOnInit();

    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(component.user).toEqual({ userId: 200, name: 'Gestor(a)' });
  });

  it('deve redirecionar para /login quando não houver usuário', () => {
    localStorageSpy.get.and.returnValue(null);

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve buscar campanhas do usuário no ngOnInit', fakeAsync(() => {
    const mockUser = { userId: 14, name: 'Admin' };
    const mockCampaigns = [{ id: 1, title: 'C1' }, { id: 2, title: 'C2' }];

    localStorageSpy.get.and.returnValue(mockUser);
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(mockCampaigns));

    component.ngOnInit();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith(14);
    expect(component.campaigns).toEqual(mockCampaigns);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaigns deve atualizar lista de campanhas', fakeAsync(() => {
    const mockCampaigns = [{ id: 11 }, { id: 13 }];
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(mockCampaigns));

    component.getCampaigns('meuid');
    tick();

    expect(component.campaigns).toEqual(mockCampaigns);
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});