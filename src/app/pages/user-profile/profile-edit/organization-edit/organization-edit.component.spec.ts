// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { OrganizationEditComponent } from './organization-edit.component';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { LinkService } from 'src/app/shared/services/link.service';
// import { OrganizationInfoService } from 'src/app/shared/services/organizationInfo.service';
// import { ProfileService } from 'src/app/shared/services/profile.service';
// import { of, throwError } from 'rxjs';
// import { PixType } from 'src/app/shared/enums/pixType';
// import { LinkType } from 'src/app/shared/enums/linkType';
// import { Component, forwardRef, Input } from '@angular/core';
// import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// // ---- STUBS PARA COMPONENTES CUSTOMIZADOS USADOS NO HTML DO COMPONENTE ----
// @Component({
//   selector: 'app-custom-input',
//   template: '',
//   providers: [{
//     provide: NG_VALUE_ACCESSOR,
//     useExisting: forwardRef(() => CustomInputStubComponent),
//     multi: true
//   }]
// })
// class CustomInputStubComponent implements ControlValueAccessor {
//   @Input() formControlName: string;
//   writeValue(obj: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
//   setDisabledState?(isDisabled: boolean): void {}
// }

// @Component({ selector: 'app-custom-select', template: '', providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomSelectStubComponent), multi: true }] })
// class CustomSelectStubComponent implements ControlValueAccessor {
//   @Input() formControlName: string;
//   @Input() options: any[]; // ajuste conforme seu input real
//   writeValue(obj: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
//   setDisabledState?(isDisabled: boolean): void {}
// }

// @Component({ selector: 'app-custom-textarea', template: '', providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomTextareaStubComponent), multi: true }] })
// class CustomTextareaStubComponent implements ControlValueAccessor {
//   @Input() formControlName: string;
//   writeValue(obj: any): void {}
//   registerOnChange(fn: any): void {}
//   registerOnTouched(fn: any): void {}
//   setDisabledState?(isDisabled: boolean): void {}
// }

// class NewProfile { constructor(v: any){ Object.assign(this, v); } }
// class UpdateProfile { constructor(v?: any){ if(v) Object.assign(this, v); } }
// class NewOrganizationInfo { constructor(v?: any){ if(v) Object.assign(this, v); } }
// class NewLink { constructor(v: any){ Object.assign(this, v); } }

// describe('OrganizationEditComponent', () => {
//   let component: OrganizationEditComponent;
//   let fixture: ComponentFixture<OrganizationEditComponent>;
//   let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
//   let profileServiceSpy: jasmine.SpyObj<ProfileService>;
//   let linkServiceSpy: jasmine.SpyObj<LinkService>;
//   let organizationInfoServiceSpy: jasmine.SpyObj<OrganizationInfoService>;

//   beforeEach(async () => {
//     spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     profileServiceSpy = jasmine.createSpyObj('ProfileService', ['createProfile', 'updateProfile']);
//     linkServiceSpy = jasmine.createSpyObj('LinkService', ['createLink', 'getLinksByProfileId', 'deleteLink']);
//     organizationInfoServiceSpy = jasmine.createSpyObj('OrganizationInfoService', [
//       'getOrganizationInfoByUserId',
//       'updateOrganizationInfo',
//       'createOrganizationInfo'
//     ]);

//     profileServiceSpy.createProfile.and.returnValue(of({}));
//     profileServiceSpy.updateProfile.and.returnValue(of({}));
//     linkServiceSpy.createLink.and.returnValue(of({}));
//     linkServiceSpy.getLinksByProfileId.and.returnValue(of([]));
//     linkServiceSpy.deleteLink.and.returnValue(of({}));
//     organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(of({}));
//     organizationInfoServiceSpy.updateOrganizationInfo.and.returnValue(of({}));
//     organizationInfoServiceSpy.createOrganizationInfo.and.returnValue(of({}));

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [
//         OrganizationEditComponent,
//         CustomInputStubComponent,
//         CustomSelectStubComponent,
//         CustomTextareaStubComponent,
//         // ...adicione outros stubs aqui conforme necessário!
//       ],
//       providers: [
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: ProfileService, useValue: profileServiceSpy },
//         { provide: LinkService, useValue: linkServiceSpy },
//         { provide: OrganizationInfoService, useValue: organizationInfoServiceSpy },
//         FormBuilder
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(OrganizationEditComponent);
//     component = fixture.componentInstance;
//     component.user = { userId: 'USER1', name: 'Ong', email: 'o@o.com', phone: '11' };
//     component.profile = { profileId: 'P1', name: 'ONG', phone: '11', email: 'e', address: 'rua', city: 'c', state: 's', zip: 'z', description: 'd' };
//     component.createForm(new UpdateProfile());
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     fixture.detectChanges();
//   });

//   it('deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit deve inicializar formulários, buscar infos e preencher campos se profile existir', () => {
//     spyOn(component, 'createForm').and.callThrough();
//     spyOn(component, 'createFormOrganizationInfo').and.callThrough();
//     spyOn(component, 'fillFieldsByUser').and.callThrough();
//     spyOn(component, 'getLinkIcons').and.callThrough();
//     spyOn(component, 'getOrganizationInfoByUserId').and.callFake(() => {});
//     spyOn(component, 'getPixType').and.callThrough();
//     spyOn(component, 'fillfields').and.callThrough();
//     spyOn(component, 'getLinks').and.callFake(() => {});

//     component.ngOnInit();

//     expect(component.createForm).toHaveBeenCalled();
//     expect(component.createFormOrganizationInfo).toHaveBeenCalled();
//     expect(component.fillFieldsByUser).toHaveBeenCalled();
//     expect(component.getLinkIcons).toHaveBeenCalled();
//     expect(component.getOrganizationInfoByUserId).toHaveBeenCalledWith('USER1');
//     expect(component.getPixType).toHaveBeenCalled();
//     expect(component.fillfields).toHaveBeenCalled();
//     expect(component.getLinks).toHaveBeenCalled();
//   });

//   it('createForm deve montar um form adequado', () => {
//     component.createForm(new UpdateProfile());
//     expect(component.form.contains('name')).toBeTrue();
//     expect(component.form.contains('email')).toBeTrue();
//     expect(component.form.controls['name'].validator).toBeTruthy();
//   });

//   it('createFormOrganizationInfo deve funcionar', () => {
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     expect(component.formOrganizationInfo.contains('userId')).toBeTrue();
//     expect(component.formOrganizationInfo.contains('pixKey')).toBeTrue();
//   });

//   it('fillFieldsByUser deve preencher campos do usuário', () => {
//     component.createForm(new UpdateProfile());
//     component.user = { name: 'ONG', email: 'org@x', phone: '8899' };
//     component.fillFieldsByUser();
//     expect(component.getControl('name').value).toBe('ONG');
//     expect(component.getControl('phone').value).toBe('8899');
//     expect(component.getControl('email').value).toBe('org@x');
//   });

//   it('fillfields deve preencher campos do profile', () => {
//     component.createForm(new UpdateProfile());
//     component.profile = { name: 'ONGYX', address:'R', city:'C', state:'S', zip:'Z', phone:'P', description:'DESC' };
//     component.fillfields();
//     expect(component.getControl('name').value).toBe('ONGYX');
//     expect(component.getControl('address').value).toBe('R');
//     expect(component.getControl('description').value).toBe('DESC');
//   });

//   it('fillfieldsOrganizationInfo deve preencher campos do organizationInfo', () => {
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     component.organizationInfo = {
//       pixKey: '123', pixType: PixType.PHONE, beneficiaryName: 'ONG',
//       beneficiaryCity:'C', contactName:'N', contactPhone:'P'
//     };
//     component.fillfieldsOrganizationInfo();
//     expect(component.getControlOrganizationInfo('pixKey').value).toBe('123');
//     expect(component.getControlOrganizationInfo('pixType').value).toBe(PixType.PHONE);
//     expect(component.getControlOrganizationInfo('beneficiaryName').value).toBe('ONG');
//   });

//   it('validateFields marca campos vazios como touched', () => {
//     component.createForm(new UpdateProfile());
//     const nameCtrl = component.form.get('name');
//     nameCtrl.setValue('');
//     spyOn(nameCtrl, 'markAsTouched');
//     component['validateFields']();
//     expect(nameCtrl.markAsTouched).toHaveBeenCalled();
//   });

//   it('saveProfile deve validar campos se form inválido', () => {
//     component.createForm(new UpdateProfile());
//     component.form.get('name').setValue('');
//     spyOn(component as any, 'validateFields').and.callThrough();
//     component.saveProfile();
//     expect((component as any).validateFields).toHaveBeenCalled();
//   });

//   it('saveProfile chama updateProfile se profile existir', () => {
//     spyOn(component, 'updateProfile');
//     component.createForm(new UpdateProfile());
//     component.profile = { profileId:'any' };
//     component.form.get('name').setValue('ONG');
//     component.form.get('email').setValue('e');
//     component.form.get('address').setValue('r');
//     component.form.get('city').setValue('c');
//     component.form.get('state').setValue('s');
//     component.form.get('zip').setValue('z');
//     component.form.get('phone').setValue('p');
//     component.form.get('description').setValue('x');
//     component.saveProfile();
//     expect(component.updateProfile).toHaveBeenCalled();
//   });

//   it('saveProfile chama createProfile se profile não existir', () => {
//     spyOn(component, 'createProfile');
//     component.createForm(new UpdateProfile());
//     component.profile = null;
//     component.form.get('name').setValue('ONG');
//     component.form.get('email').setValue('e');
//     component.form.get('address').setValue('r');
//     component.form.get('city').setValue('c');
//     component.form.get('state').setValue('s');
//     component.form.get('zip').setValue('z');
//     component.form.get('phone').setValue('p');
//     component.form.get('description').setValue('x');
//     component.saveProfile();
//     expect(component.createProfile).toHaveBeenCalled();
//   });

//   it('createProfile deve chamar service, alertar sucesso, e decidir se chama updateOrganizationInfo ou createOrganizationInfo', fakeAsync(() => {
//     profileServiceSpy.createProfile.and.returnValue(of({}));
//     spyOn(component, 'updateOrganizationInfo');
//     spyOn(component, 'createOrganizationInfo');
//     component.organizationInfo = { foo: 1 };
//     component.createProfile({});
//     tick();
//     expect(component.alertSuccess).toContain('Alterações Salvas');
//     expect(component.updateOrganizationInfo).toHaveBeenCalled();

//     // agora sem organizationInfo
//     component.organizationInfo = null;
//     component.createProfile({});
//     tick();
//     expect(component.createOrganizationInfo).toHaveBeenCalled();
//   }));

//   it('createProfile deve alertar erro caso o service falhe', fakeAsync(() => {
//     profileServiceSpy.createProfile.and.returnValue(throwError(() => new Error()));
//     component.createProfile({});
//     tick();
//     expect(component.alertError).toContain('Erro ao Salvar Perfil');
//   }));

//   it('updateProfile deve chamar updateProfile e decidir updateOrganizationInfo ou createOrganizationInfo', fakeAsync(() => {
//     profileServiceSpy.updateProfile.and.returnValue(of({}));
//     spyOn(component, 'updateOrganizationInfo');
//     spyOn(component, 'createOrganizationInfo');
//     component.organizationInfo = { foo: 1 };
//     component.updateProfile({});
//     tick();
//     expect(component.updateOrganizationInfo).toHaveBeenCalled();

//     component.organizationInfo = null;
//     component.updateProfile({});
//     tick();
//     expect(component.createOrganizationInfo).toHaveBeenCalled();
//   }));

//   it('updateProfile deve setar alertError com erro da API', fakeAsync(() => {
//     profileServiceSpy.updateProfile.and.returnValue(throwError(() => ({})));
//     component.updateProfile({});
//     tick();
//     expect(component.alertError).toContain('Erro ao Salvar Perfil');
//   }));

//   it('getOrganizationInfoByUserId deve preencher organizationInfo e campos, controlar spinner', fakeAsync(() => {
//     const orgInfo = {
//       organizationInfoId: 'Z', pixKey: 'P', pixType: PixType.PHONE, beneficiaryName: 'N',
//       beneficiaryCity: 'C', contactName: 'N', contactPhone:'P'
//     };
//     organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(of(orgInfo));
//     spyOn(component, 'fillfieldsOrganizationInfo');
//     component.getOrganizationInfoByUserId('USERID');
//     tick();
//     expect(spinnerSpy.show).toHaveBeenCalled();
//     expect(component.organizationInfo).toEqual(orgInfo);
//     expect(component.fillfieldsOrganizationInfo).toHaveBeenCalled();
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('updateOrganizationInfo deve validar campos e chamar service', fakeAsync(() => {
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     component.user = { userId: '123' };
//     component.formOrganizationInfo.get('pixType').setValue(PixType.PHONE);
//     component.formOrganizationInfo.get('pixKey').setValue('k');
//     component.formOrganizationInfo.get('beneficiaryName').setValue('b');
//     component.formOrganizationInfo.get('beneficiaryCity').setValue('c');
//     component.formOrganizationInfo.get('contactName').setValue('n');
//     component.formOrganizationInfo.get('contactPhone').setValue('p');
//     component.organizationInfo = { organizationInfoId: 'OID'};
//     organizationInfoServiceSpy.updateOrganizationInfo.and.returnValue(of({}));
//     component.updateOrganizationInfo();
//     tick();
//     expect(organizationInfoServiceSpy.updateOrganizationInfo)
//       .toHaveBeenCalledWith('OID', component.formOrganizationInfo.value);
//     expect(component.alertSuccess).toContain('Alterações Salvas');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('updateOrganizationInfo deve alertar erro ao falhar', fakeAsync(() => {
//     component.organizationInfo = { organizationInfoId: 'OID'};
//     organizationInfoServiceSpy.updateOrganizationInfo.and.returnValue(throwError(() => new Error()));
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     component.user = { userId: '123' };
//     component.formOrganizationInfo.get('pixType').setValue(PixType.PHONE);
//     component.formOrganizationInfo.get('pixKey').setValue('k');
//     component.formOrganizationInfo.get('beneficiaryName').setValue('b');
//     component.formOrganizationInfo.get('beneficiaryCity').setValue('c');
//     component.formOrganizationInfo.get('contactName').setValue('n');
//     component.formOrganizationInfo.get('contactPhone').setValue('p');
//     component.updateOrganizationInfo();
//     tick();
//     expect(component.alertError).toContain('Erro ao salvar informações');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('createOrganizationInfo deve validar campos e chamar service', fakeAsync(() => {
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     component.user = { userId: '123' };
//     component.formOrganizationInfo.get('pixType').setValue(PixType.PHONE);
//     component.formOrganizationInfo.get('pixKey').setValue('k');
//     component.formOrganizationInfo.get('beneficiaryName').setValue('b');
//     component.formOrganizationInfo.get('beneficiaryCity').setValue('c');
//     component.formOrganizationInfo.get('contactName').setValue('n');
//     component.formOrganizationInfo.get('contactPhone').setValue('p');
//     organizationInfoServiceSpy.createOrganizationInfo.and.returnValue(of({}));
//     component.createOrganizationInfo();
//     tick();
//     expect(organizationInfoServiceSpy.createOrganizationInfo)
//       .toHaveBeenCalledWith(component.formOrganizationInfo.value);
//     expect(component.alertSuccess).toContain('Alterações Salvas');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('createOrganizationInfo deve alertar erro ao falhar', fakeAsync(() => {
//     organizationInfoServiceSpy.createOrganizationInfo.and.returnValue(throwError(() => new Error()));
//     component.createFormOrganizationInfo(new NewOrganizationInfo());
//     component.user = { userId: '123' };
//     component.formOrganizationInfo.get('pixType').setValue(PixType.PHONE);
//     component.formOrganizationInfo.get('pixKey').setValue('k');
//     component.formOrganizationInfo.get('beneficiaryName').setValue('b');
//     component.formOrganizationInfo.get('beneficiaryCity').setValue('c');
//     component.formOrganizationInfo.get('contactName').setValue('n');
//     component.formOrganizationInfo.get('contactPhone').setValue('p');
//     component.createOrganizationInfo();
//     tick();
//     expect(component.alertError).toContain('Erro ao salvar informações');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('addLink deve adicionar link com sucesso', fakeAsync(() => {
//     component.profile = { profileId: 'PID' };
//     component.selectedOption = { id: LinkType.FACEBOOK };
//     component.link = 'https://f.com';
//     linkServiceSpy.createLink.and.returnValue(of({ linkId: 1, url: 'https://f.com', type: LinkType.FACEBOOK }));
//     component.links = [];
//     component.addLink();
//     tick();
//     expect(component.links.length).toBe(1);
//     expect(component.link).toBeNull();
//     expect(component.selectedOption).toBeNull();
//   }));

//   it('addLink deve alertar erro ao falhar', fakeAsync(() => {
//     component.profile = { profileId: 'PID' };
//     component.selectedOption = { id: LinkType.FACEBOOK };
//     component.link = 'fail';
//     linkServiceSpy.createLink.and.returnValue(throwError(() => new Error()));
//     component.addLink();
//     tick();
//     expect(component.alertError).toContain('Erro ao adicionar link');
//   }));

//   it('getLinks deve popular links', fakeAsync(() => {
//     linkServiceSpy.getLinksByProfileId.and.returnValue(of([{ linkId:1, url: 'u'}]));
//     component.profile = { profileId: 'PX' };
//     component.getLinks();
//     tick();
//     expect(component.links.length).toBe(1);
//   }));

//   it('getLinks deve alertar erro ao falhar', fakeAsync(() => {
//     linkServiceSpy.getLinksByProfileId.and.returnValue(throwError(() => new Error()));
//     component.profile = { profileId: 'PERR' };
//     component.getLinks();
//     tick();
//     expect(component.alertError).toContain('Erro ao buscar links');
//   }));

//   it('removeLink deve remover e atualizar links', fakeAsync(() => {
//     linkServiceSpy.deleteLink.and.returnValue(of({}));
//     spyOn(component, 'getLinks');
//     component.removeLink({ linkId: '123' });
//     tick();
//     expect(linkServiceSpy.deleteLink).toHaveBeenCalledWith('123');
//     expect(component.getLinks).toHaveBeenCalled();
//   }));

//   it('removeLink deve alertar erro ao falhar', fakeAsync(() => {
//     linkServiceSpy.deleteLink.and.returnValue(throwError(() => new Error()));
//     component.removeLink({ linkId: 'xxx' });
//     tick();
//     expect(component.alertError).toContain('Erro ao buscar Links');
//   }));

//   it('getSocialIcon retorna o ícone correspondente', () => {
//     expect(component.getSocialIcon(LinkType.INSTAGRAM)).toContain('instagram');
//     expect(component.getSocialIcon(LinkType.FACEBOOK)).toContain('facebook');
//     expect(component.getSocialIcon(LinkType.LINKEDIN)).toContain('linkedin');
//     expect(component.getSocialIcon(LinkType.OTHER)).toContain('link.svg');
//   });

//   it('getLinkIcons preenche options', () => {
//     component.getLinkIcons();
//     expect(component.options.length).toBeGreaterThan(0);
//   });

//   it('getPixType preenche pixTypeOptions', () => {
//     component.getPixType();
//     expect(component.pixTypeOptions.length).toBeGreaterThan(0);
//   });
// });