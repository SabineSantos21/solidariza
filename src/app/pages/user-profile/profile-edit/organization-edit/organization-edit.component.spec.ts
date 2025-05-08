import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationEditComponent } from './organization-edit.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { LinkService } from 'src/app/shared/services/link.service';
import { OrganizationInfoService } from 'src/app/shared/services/organizationInfo.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrganizationEditComponent', () => {
  let component: OrganizationEditComponent;
  let fixture: ComponentFixture<OrganizationEditComponent>;
  let mockSpinner: any;
  let mockProfileService: any;
  let mockLinkService: any;
  let mockOrganizationInfoService: any;

  beforeEach(async () => {
    mockSpinner = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    mockProfileService = {
      createProfile: jasmine.createSpy('createProfile').and.returnValue(of({})),
      updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of({}))
    };
    mockLinkService = {
      createLink: jasmine.createSpy('createLink').and.returnValue(of({})),
      getLinksByProfileId: jasmine.createSpy('getLinksByProfileId').and.returnValue(of([])),
      deleteLink: jasmine.createSpy('deleteLink').and.returnValue(of({}))
    };
    mockOrganizationInfoService = {
      getOrganizationInfoByUserId: jasmine.createSpy('getOrganizationInfoByUserId').and.returnValue(of({})),
      updateOrganizationInfo: jasmine.createSpy('updateOrganizationInfo').and.returnValue(of({})),
      createOrganizationInfo: jasmine.createSpy('createOrganizationInfo').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [OrganizationEditComponent],
      providers: [
        FormBuilder,
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: LinkService, useValue: mockLinkService },
        { provide: OrganizationInfoService, useValue: mockOrganizationInfoService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // para ignorar elementos desconhecidos do template
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditComponent);
    component = fixture.componentInstance;
    // mocks simples para user e profile
    component.user = { userId: 10, name: 'User1', email: 'user@email.com', phone: '123456' };
    component.profile = { profileId: 1, name: 'empresa', address: 'rua', city: 'cidade', state: 'estado', zip: '123', phone: '999', description: 'desc' };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulários no ngOnInit', () => {
    spyOn(component, 'createForm').and.callThrough();
    spyOn(component, 'createFormOrganizationInfo').and.callThrough();
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.createFormOrganizationInfo).toHaveBeenCalled();
    expect(component.form).toBeDefined();
    expect(component.formOrganizationInfo).toBeDefined();
  });

  it('deve chamar getLinks caso profile exista no ngOnInit', () => {
    spyOn(component, 'getLinks');
    component.ngOnInit();
    expect(component.getLinks).toHaveBeenCalled();
  });

  it('deve chamar updateProfile se profile existir e o formulário for válido', () => {
    spyOn(component, 'updateProfile');
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@exemplo.com');
    component.form.controls['address'].setValue('Rua');
    component.form.controls['city'].setValue('Cidade');
    component.form.controls['state'].setValue('SP');
    component.form.controls['zip'].setValue('12345');
    component.form.controls['phone'].setValue('9999');
    component.form.controls['description'].setValue('Desc');
    component.saveProfile();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('deve chamar createProfile se profile não existir e o formulário for válido', () => {
    component.profile = null;
    spyOn(component, 'createProfile');
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@exemplo.com');
    component.form.controls['address'].setValue('Rua');
    component.form.controls['city'].setValue('Cidade');
    component.form.controls['state'].setValue('SP');
    component.form.controls['zip'].setValue('12345');
    component.form.controls['phone'].setValue('9999');
    component.form.controls['description'].setValue('Desc');
    component.saveProfile();
    expect(component.createProfile).toHaveBeenCalled();
  });

  it('deve adicionar link com dados válidos', () => {
    component.profile = { profileId: 33 };
    component.selectedOption = { id: 2 };
    component.link = 'http://test.com';
    mockLinkService.createLink.and.returnValue(of({ id: 1, url: 'http://test.com' }));
    component.links = [];
    component.addLink();
    expect(component.links.length).toBe(1);
    expect(component.link).toBeNull();
    expect(component.selectedOption).toBeNull();
  });

  it('deve buscar links e atualizar this.links', () => {
    const fakeLinks = [{ id: 1 }, { id: 2 }];
    mockLinkService.getLinksByProfileId.and.returnValue(of(fakeLinks));
    component.profile = { profileId: 5 };
    component.getLinks();
    expect(component.links).toEqual(fakeLinks);
  });

  it('deve mostrar mensagem de erro ao falhar em buscar links', () => {
    mockLinkService.getLinksByProfileId.and.returnValue(throwError('erro'));
    component.profile = { profileId: 5 };
    component.getLinks();
    expect(component.alertError).toContain('Erro ao buscar links');
  });
});