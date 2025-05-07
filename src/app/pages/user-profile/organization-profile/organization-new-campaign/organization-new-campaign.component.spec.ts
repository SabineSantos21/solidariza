import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationNewCampaignComponent } from './organization-new-campaign.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { CampaignType } from 'src/app/shared/enums/campaignType';

describe('OrganizationNewCampaignComponent', () => {
  let component: OrganizationNewCampaignComponent;
  let fixture: ComponentFixture<OrganizationNewCampaignComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['createCampaign']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [OrganizationNewCampaignComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationNewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit deve preparar formulário, enums e usuário', () => {
    spyOn(component, 'createForm').and.callThrough();
    spyOn(component, 'getCampaignStatus').and.callThrough();
    spyOn(component, 'getCampaignType').and.callThrough();
    spyOn(component, 'getUser').and.callThrough();
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.getCampaignStatus).toHaveBeenCalled();
    expect(component.getCampaignType).toHaveBeenCalled();
    expect(component.getUser).toHaveBeenCalled();
  });

  it('createForm deve inicializar todos os controles com new NewCampaign', () => {
    component.createForm({} as any);
    expect(component.form.contains('title')).toBeTrue();
    expect(component.form.contains('userId')).toBeTrue();
    expect(component.form.contains('status')).toBeTrue();
    expect(component.form.controls['title'].validator).toBeTruthy();
  });

  it('getCampaignStatus e getCampaignType preenchem seus arrays', () => {
    component.getCampaignStatus();
    expect(component.campaignStatus.length).toBe(3);
    component.getCampaignType();
    expect(component.campaignType.length).toBe(2);
  });

  it('getUser deve carregar usuário do localStorage', () => {
    localStorageSpy.get.and.returnValue({ userId: 'U1', name: 'ONG Teste' });
    component.getUser();
    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(component.user.name).toBe('ONG Teste');
  });

  it('validateFields marca controles vazios/touch', () => {
    component.createForm({} as any);
    const titleControl = component.form.controls['title'];
    titleControl.setValue('');
    spyOn(titleControl, 'markAsTouched');
    component['validateFields']();
    expect(titleControl.markAsTouched).toHaveBeenCalled();
  });

  it('createCampaign deve validar se form está inválido', () => {
    component.createForm({} as any);
    component.user = { userId: 'ONGX' };
    component.form.controls['title'].setValue('');
    spyOn(component as any, 'validateFields').and.callThrough();
    component.createCampaign();
    expect((component as any).validateFields).toHaveBeenCalled();
  });

  it('createCampaign deve chamar o serviço, alertar e redirecionar com sucesso', fakeAsync(() => {
    component.createForm({
      userId: '',
      title: 'C1',
      description: 'desc',
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      status: CampaignStatus.Active,
      type: CampaignType.Collection,
      address: '', state: '', city: ''
    } as any);

    component.user = { userId: 'ONG8' };
    campaignServiceSpy.createCampaign.and.returnValue(of({}));
    component.createCampaign();
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.alertSuccess).toContain('Campanha criada com sucesso');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-profile']);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('createCampaign deve alertar erro ao falhar', fakeAsync(() => {
    component.createForm({
      userId: '',
      title: 'C1',
      description: 'desc',
      startDate: '2024-01-01',
      endDate: '2024-01-05',
      status: CampaignStatus.Active,
      type: CampaignType.Collection,
      address: '', state: '', city: ''
    } as any);

    component.user = { userId: 'ONG8' };
    campaignServiceSpy.createCampaign.and.returnValue(throwError(() => new Error('Falha')));
    component.createCampaign();
    tick();
    expect(component.alertError).toContain('Erro ao criar campanha');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});