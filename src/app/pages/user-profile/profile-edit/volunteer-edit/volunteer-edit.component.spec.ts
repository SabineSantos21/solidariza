// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { VolunteerEditComponent } from './volunteer-edit.component';
// import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ProfileService } from 'src/app/shared/services/profile.service';
// import { of, throwError } from 'rxjs';

// // Stubs de modelos usados como construtores
// class NewProfile { constructor(obj: any) { Object.assign(this, obj); } }
// class UpdateProfile { constructor(obj?: any) { if(obj) Object.assign(this, obj); } }

// describe('VolunteerEditComponent', () => {
//   let component: VolunteerEditComponent;
//   let fixture: ComponentFixture<VolunteerEditComponent>;
//   let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
//   let profileServiceSpy: jasmine.SpyObj<ProfileService>;

//   beforeEach(async () => {
//     spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     profileServiceSpy = jasmine.createSpyObj('ProfileService', ['createProfile', 'updateProfile']);

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [ VolunteerEditComponent ],
//       providers: [
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: ProfileService, useValue: profileServiceSpy },
//         FormBuilder
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(VolunteerEditComponent);
//     component = fixture.componentInstance;

//     // Inputs obrigatórios para os testes
//     component.user = { userId: 'U1', name: 'Maria', email: 'm@x', phone: '19' };
//     // O form é criado/emulado em cada ngOnInit nos testes
//     fixture.detectChanges();
//   });

//   it('deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit deve montar formulário e chamar fillFieldsByUser', () => {
//     spyOn(component, 'createForm').and.callThrough();
//     spyOn(component, 'fillFieldsByUser').and.callThrough();
//     component.ngOnInit();
//     expect(component.createForm).toHaveBeenCalled();
//     expect(component.fillFieldsByUser).toHaveBeenCalled();
//   });

//   it('ngOnInit deve chamar fillfields se profile existir', () => {
//     spyOn(component, 'fillfields').and.callThrough();
//     component.profile = { name: 'João', phone:'11', description:'bla', city:'c', state:'s' };
//     component.ngOnInit();
//     expect(component.fillfields).toHaveBeenCalled();
//   });

//   it('createForm deve criar controles obrigatórios', () => {
//     component.createForm(new UpdateProfile());
//     expect(component.form.contains('name')).toBeTrue();
//     expect(component.form.contains('email')).toBeTrue();
//     expect(component.form.controls['name'].validator).toBeTruthy();
//     expect(component.form.controls['description'].validator).toBeTruthy();
//   });

//   it('fillFieldsByUser preenche campos do user', () => {
//     component.createForm(new UpdateProfile());
//     component.user = { name: 'Joana', email: 'j@j', phone: '19' };
//     component.fillFieldsByUser();
//     expect(component.getControl('name').value).toBe('Joana');
//     expect(component.getControl('email').value).toBe('j@j');
//   });

//   it('fillfields preenche campos do profile', () => {
//     component.createForm(new UpdateProfile());
//     component.profile = { name: 'Ana', phone: '11', description: 'txt', city: 'C', state: 'S' };
//     component.fillfields();
//     expect(component.getControl('name').value).toBe('Ana');
//     expect(component.getControl('phone').value).toBe('11');
//     expect(component.getControl('description').value).toBe('txt');
//     expect(component.getControl('city').value).toBe('C');
//     expect(component.getControl('state').value).toBe('S');
//   });

//   it('validateFields marca campos vazios como touched', () => {
//     component.createForm(new UpdateProfile());
//     const nameCtrl = component.getControl('name');
//     nameCtrl.setValue('');
//     spyOn(nameCtrl, 'markAsTouched');
//     component['validateFields']();
//     expect(nameCtrl.markAsTouched).toHaveBeenCalled();
//   });

//   it('saveProfile faz validateFields se form inválido', () => {
//     component.createForm(new UpdateProfile());
//     component.form.get('name').setValue('');
//     spyOn(component as any, 'validateFields').and.callThrough();
//     component.saveProfile();
//     expect((component as any).validateFields).toHaveBeenCalled();
//   });

//   it('saveProfile chama updateProfile se profile existir e form válido', () => {
//     spyOn(component, 'updateProfile');
//     component.createForm(new UpdateProfile());
//     component.profile = { profileId: 'PID' };
//     // Preenche campos obrigatórios
//     component.form.get('name').setValue('Al');
//     component.form.get('email').setValue('a@a');
//     component.form.get('description').setValue('d');
//     component.form.get('city').setValue('C');
//     component.form.get('state').setValue('S');
//     component.saveProfile();
//     expect(component.updateProfile).toHaveBeenCalled();
//   });

//   it('saveProfile chama createProfile se profile NÃO existir e form válido', () => {
//     spyOn(component, 'createProfile');
//     component.createForm(new UpdateProfile());
//     component.profile = null;
//     component.form.get('name').setValue('C');
//     component.form.get('email').setValue('x@x');
//     component.form.get('description').setValue('d');
//     component.form.get('city').setValue('C');
//     component.form.get('state').setValue('S');
//     component.saveProfile();
//     expect(component.createProfile).toHaveBeenCalled();
//   });

//   it('createProfile chama o service e alerta sucesso', fakeAsync(() => {
//     profileServiceSpy.createProfile.and.returnValue(of({}));
//     component.createForm(new UpdateProfile());
//     component.user = { userId: 'UX' };
//     component.form.get('name').setValue('A');
//     component.form.get('email').setValue('b@b');
//     component.form.get('description').setValue('desc');
//     component.form.get('city').setValue('C');
//     component.form.get('state').setValue('S');

//     component.createProfile({});
//     tick();
//     expect(component.alertSuccess).toContain('Alterações Salvas');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('createProfile alerta erro em caso de falha', fakeAsync(() => {
//     profileServiceSpy.createProfile.and.returnValue(throwError(() => new Error()));
//     component.createForm(new UpdateProfile());
//     component.user = { userId: 'UXX' };
//     component.createProfile({});
//     tick();
//     expect(component.alertError).toContain('Erro ao Salvar Perfil');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('updateProfile chama o service, alerta sucesso e fecha spinner', fakeAsync(() => {
//     profileServiceSpy.updateProfile.and.returnValue(of({}));
//     component.createForm(new UpdateProfile());
//     component.profile = { profileId: 'PPP' };
//     component.form.get('name').setValue('A');
//     component.form.get('email').setValue('b@b');
//     component.form.get('description').setValue('desc');
//     component.form.get('city').setValue('C');
//     component.form.get('state').setValue('S');

//     component.updateProfile({});
//     tick();
//     expect(component.alertSuccess).toContain('Alterações Salvas');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

//   it('updateProfile alerta erro em caso de falha', fakeAsync(() => {
//     profileServiceSpy.updateProfile.and.returnValue(throwError(() => new Error()));
//     component.createForm(new UpdateProfile());
//     component.profile = { profileId: 'PPP' };
//     component.updateProfile({});
//     tick();
//     expect(component.alertError).toContain('Erro ao Salvar Perfil');
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

// });