import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationEditCampaignComponent } from './organization-edit-campaign.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { EditCampaign } from 'src/app/shared/models/campaign';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CampaignStatus } from 'src/app/shared/enums/campaignStatus';
import { CampaignType } from 'src/app/shared/enums/campaignType';

describe('OrganizationEditCampaignComponent', () => {
  let component: OrganizationEditCampaignComponent;
  let fixture: ComponentFixture<OrganizationEditCampaignComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', [
      'getCampaignById',
      'updateCampaign',
      'deleteCampaign'
    ]);
    campaignServiceSpy.getCampaignById.and.returnValue(of({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: '',
        type: '',
        address: '',
        state: '',
        city: ''
      }));
    campaignServiceSpy.updateCampaign.and.returnValue(of({}));
    campaignServiceSpy.deleteCampaign.and.returnValue(of({}));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '100'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [OrganizationEditCampaignComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        FormBuilder
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationEditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário e buscar informações se houver campaignId', fakeAsync(() => {
    spyOn(component, 'createForm').and.callThrough();
    spyOn(component, 'getCampaignById').and.callThrough();
    component.ngOnInit();
    tick();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.getCampaignById).toHaveBeenCalledWith('100');
    // Arrays de status e type são definidos estaticamente no construtor/refatoração.
    expect(component.campaignStatus.length).toBeGreaterThan(0);
    expect(component.campaignType.length).toBeGreaterThan(0);
  }));

  it('deve redirecionar para /user-profile se não houver id na rota', () => {
    activatedRouteMock.snapshot.paramMap.get = () => null;
    fixture = TestBed.createComponent(OrganizationEditCampaignComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-profile']);
  });

  it('createForm monta form corretamente com o EditCampaign', () => {
    const campaign = new EditCampaign();
    campaign.title = 'C1';
    campaign.description = 'D';
    campaign.status = CampaignStatus.Active;
    campaign.type = CampaignType.Collection;
    component.createForm(campaign);
    expect(component.form.value.title).toBe('C1');
    expect(component.form.controls['description'].value).toBe('D');
  });

  it('fillFields preenche todos os controles do form', () => {
    const data = {
      title: 'TítuloX', description: 'Desc', startDate: '2022-01-01', endDate: '2022-02-01',
      status: 'active', type: 'collection', address: 'Rua', state: 'UF', city: 'City'
    };
    component.createForm(new EditCampaign());
    component.fillFields(data);
    // patchValue pode não preencher campos ausentes, mas objeto completo funciona.
    expect(component.form.value).toEqual(data);
  });

  it('getCampaignById deve preencher form com dados recebidos e controlar spinner', fakeAsync(() => {
    const campaignData = {
      title: 'T', description: 'D', startDate: '', endDate: '', status: '', type: '',
      address: '', state: '', city: ''
    };
    campaignServiceSpy.getCampaignById.and.returnValue(of(campaignData));
    spyOn(component, 'fillFields');
    component.getCampaignById('155');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.fillFields).toHaveBeenCalledWith(campaignData);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignById deve preencher alertError se houver erro', fakeAsync(() => {
    campaignServiceSpy.getCampaignById.and.returnValue(throwError(() => new Error('Erro API')));
    component.getCampaignById('X');
    tick();
    expect(component.alertError).toContain('Erro ao buscar campanha');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('updateCampaign deve validar campos e mostrar erro se form inválido', () => {
    component.createForm(new EditCampaign());
    component.form.controls['title'].setValue(''); // torna o form inválido
    spyOn(component as any, 'validateFields').and.callThrough();
    component.updateCampaign();
    expect((component as any).validateFields).toHaveBeenCalled();
  });

  it('updateCampaign deve chamar service e exibir sucesso', fakeAsync(() => {
    component.campaignId = '101';
    const campaign = new EditCampaign();
    campaign.title = 'ok';
    campaign.description = 'desc';
    campaign.startDate = new Date();
    campaign.endDate = new Date();
    campaign.status = CampaignStatus.Active;
    campaign.type = CampaignType.Collection;
    component.createForm(campaign);
    campaignServiceSpy.updateCampaign.and.returnValue(of({}));
    component.updateCampaign();
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.updateCampaign).toHaveBeenCalledWith('101', component.form.value);
    expect(component.alertSuccess).toContain('Alterações salvas com sucesso!'); // Corrigido para mensagem padronizada
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('updateCampaign deve exibir erro em caso de falha', fakeAsync(() => {
    component.campaignId = '105';
    const campaign = new EditCampaign();
    campaign.title = 'ok';
    campaign.description = 'desc';
    campaign.startDate = new Date();
    campaign.endDate = new Date();
    campaign.status = CampaignStatus.Active;
    campaign.type = CampaignType.Collection;
    component.createForm(campaign);
    campaignServiceSpy.updateCampaign.and.returnValue(throwError(() => new Error('Falhou')));
    component.updateCampaign();
    tick();
    expect(component.alertError).toContain('Erro ao salvar alterações');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deleteCampaign deve chamar o serviço e alertar sucesso', fakeAsync(() => {
    campaignServiceSpy.deleteCampaign.and.returnValue(of({}));
    component.deleteCampaign('123');
    tick();
    expect(campaignServiceSpy.deleteCampaign).toHaveBeenCalledWith('123');
    expect(component.alertSuccess).toContain('Campanha deletada com sucesso');
  }));

});