import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationProfileComponent } from './organization-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LinkService } from 'src/app/shared/services/link.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { OrganizationInfoService } from 'src/app/shared/services/organizationInfo.service';
import { of, throwError } from 'rxjs';
import { LinkType } from 'src/app/shared/enums/linkType';

describe('OrganizationProfileComponent', () => {
  let component: OrganizationProfileComponent;
  let fixture: ComponentFixture<OrganizationProfileComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let linkServiceSpy: jasmine.SpyObj<LinkService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let organizationInfoServiceSpy: jasmine.SpyObj<OrganizationInfoService>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    linkServiceSpy = jasmine.createSpyObj('LinkService', ['getLinksByProfileId']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignByUserId']);
    organizationInfoServiceSpy = jasmine.createSpyObj('OrganizationInfoService', [
      'getOrganizationInfoByUserId', 'organizationInfoValidateByOrganizationInfoId'
    ]);
    linkServiceSpy.getLinksByProfileId.and.returnValue(of([]));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of([]));
    organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(of({}));
    organizationInfoServiceSpy.organizationInfoValidateByOrganizationInfoId.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ OrganizationProfileComponent ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LinkService, useValue: linkServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: OrganizationInfoService, useValue: organizationInfoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationProfileComponent);
    component = fixture.componentInstance;
    // Prepare dados mínimos
    component.user = { userId: 'org12' };
    component.profile = { profileId: 'prof1' };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve chamar getOrganizationInfo e getLinks se profile estiver definido', fakeAsync(() => {
      spyOn(component, 'getOrganizationInfo');
      spyOn(component, 'getLinks');
      component.profile = { profileId: 'p987' };
      component.user = { userId: 'u213' };
      component.ngOnInit();
      expect(component.getOrganizationInfo).toHaveBeenCalledWith('u213');
      expect(component.getLinks).toHaveBeenCalled();
    }));

    it('não deve chamar os métodos se profile não estiver definido', () => {
      spyOn(component, 'getOrganizationInfo');
      spyOn(component, 'getLinks');
      component.profile = null;
      component.ngOnInit();
      expect(component.getOrganizationInfo).not.toHaveBeenCalled();
      expect(component.getLinks).not.toHaveBeenCalled();
    });
  });

  it('getOrganizationInfo deve popular organizationInfo e controlar spinner', fakeAsync(() => {
    const infoMock = { name: 'ONG', cnpj: '123' };
    organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(of(infoMock));
    component.getOrganizationInfo('50');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.organizationInfo).toEqual(infoMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getOrganizationInfo deve tratar fluxo de erro', fakeAsync(() => {
    organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(throwError(() => ({})));
    component.organizationInfo = null;
    component.getOrganizationInfo('51');
    tick();
    // Não tem mensagem definida, mas spinner deve ser ocultado
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('validateOrganization deve atualizar organizationInfo e tratar erro', fakeAsync(() => {
    organizationInfoServiceSpy.organizationInfoValidateByOrganizationInfoId.and.returnValue(of({valid: true}));
    spyOn(component, 'removeSpecialCharacters').and.returnValue('00345');
    component.validateOrganization('oid', '00.345');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.organizationInfo).toEqual({valid: true});
    expect(spinnerSpy.hide).toHaveBeenCalled();

    // erro
    organizationInfoServiceSpy.organizationInfoValidateByOrganizationInfoId.and.returnValue(throwError(() => ({})));
    component.alertError = '';
    component.validateOrganization('oid2', '123.456');
    tick();
    expect(component.alertError).toContain('Erro ao validar empresa.');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('removeSpecialCharacters remove caracteres especiais', () => {
    expect(component.removeSpecialCharacters('abc-123.  o#p')).toBe('abc123  op');
    expect(component.removeSpecialCharacters('CNPJ 12.345/678-9')).toBe('CNPJ 123456789');
  });

  it('getLinks deve alertar erro ao buscar links', fakeAsync(() => {
    linkServiceSpy.getLinksByProfileId.and.returnValue(throwError(() => ({})));
    component.profile = { profileId: 'bad' };
    component.getLinks();
    tick();
    expect(component.alertError).toContain('Erro ao buscar links.');
  }));

  it('toggleShowLinks alterna showLinks', () => {
    component.showLinks = false;
    component.toggleShowLinks();
    expect(component.showLinks).toBeTrue();
    component.toggleShowLinks();
    expect(component.showLinks).toBeFalse();
  });

  it('getCampaignsByUserId deve buscar campanhas e controlar spinner', fakeAsync(() => {
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['A', 'B']));
    component.user = { userId: '123' };
    component.getCampaignsByUserId();
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.campaigns).toEqual(['A', 'B']);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignsByUserId deve tratar erro', fakeAsync(() => {
    campaignServiceSpy.getCampaignByUserId.and.returnValue(throwError(() => ({})));
    component.user = { userId: '999' };
    component.getCampaignsByUserId();
    tick();
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});