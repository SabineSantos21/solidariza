import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationProfileComponent } from './organization-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LinkService } from 'src/app/shared/services/link.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { OrganizationInfoService } from 'src/app/shared/services/organizationInfo.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LinkType } from 'src/app/shared/enums/linkType';

describe('OrganizationProfileComponent', () => {
  let component: OrganizationProfileComponent;
  let fixture: ComponentFixture<OrganizationProfileComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let linkServiceSpy: jasmine.SpyObj<LinkService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let organizationInfoServiceSpy: jasmine.SpyObj<OrganizationInfoService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'mockId' // Mock do método `get`
      }
    }
  };

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    linkServiceSpy = jasmine.createSpyObj('LinkService', ['getLinksByProfileId']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignByUserId']);
    organizationInfoServiceSpy = jasmine.createSpyObj('OrganizationInfoService', [
      'getOrganizationInfoByUserId', 'organizationInfoValidateByOrganizationInfoId'
    ]);

    // Mock implementações padrão
    linkServiceSpy.getLinksByProfileId.and.returnValue(of([]));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of([]));
    organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(of({}));
    organizationInfoServiceSpy.organizationInfoValidateByOrganizationInfoId.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [OrganizationProfileComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LinkService, useValue: linkServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: OrganizationInfoService, useValue: organizationInfoServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      imports: [
        RouterTestingModule // Necessário para lidar com ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationProfileComponent);
    component = fixture.componentInstance;

    // Dados iniciais do componente
    component.user = { userId: 'org12' };
    component.profile = { profileId: 'prof1' };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('validateOrganization deve atualizar organizationInfo e tratar erro', fakeAsync(() => {
    organizationInfoServiceSpy.organizationInfoValidateByOrganizationInfoId.and.returnValue(of({ valid: true }));
    spyOn(component, 'removeSpecialCharacters').and.returnValue('00345');
    component.validateOrganization('oid', '00.345');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.organizationInfo).toEqual({ valid: true });
    expect(spinnerSpy.hide).toHaveBeenCalled();

    // Teste de erro
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

  it('getCampaignsByUserId deve buscar campanhas e controlar spinner', fakeAsync(() => {
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['A', 'B']));
    component.user = { userId: '123' };
    component.getCampaignsByUserId();
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.campaigns).toEqual(['A', 'B']);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));
});