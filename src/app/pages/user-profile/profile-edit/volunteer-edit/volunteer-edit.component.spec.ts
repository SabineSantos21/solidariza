import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolunteerEditComponent } from './volunteer-edit.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

// Mock do pipe 'mask'
@Pipe({ name: 'mask' })
class MockMaskPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value;
  }
}

describe('VolunteerEditComponent', () => {
  let component: VolunteerEditComponent;
  let fixture: ComponentFixture<VolunteerEditComponent>;
  let mockSpinner: any;
  let mockProfileService: any;

  beforeEach(async () => {
    mockSpinner = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };
    mockProfileService = {
      createProfile: jasmine.createSpy('createProfile').and.returnValue(of({})),
      updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [
        VolunteerEditComponent,
        MockMaskPipe // Inclua o mock do pipe aqui!
      ],
      providers: [
        FormBuilder,
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: ProfileService, useValue: mockProfileService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerEditComponent);
    component = fixture.componentInstance;
    component.user = { userId: 10, name: 'User1', email: 'user@email.com' };
    component.profile = { profileId: 1, name: 'Joana', phone: '123', email: 'joana@email.com', description: 'desc', city: 'city', state: 'state' };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário no ngOnInit', () => {
    spyOn(component, 'createForm').and.callThrough();
    spyOn(component, 'fillFieldsByUser').and.callThrough();
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.fillFieldsByUser).toHaveBeenCalled();
    expect(component.form).toBeDefined();
  });

  it('deve chamar fillfields se profile existir no ngOnInit', () => {
    spyOn(component, 'fillfields');
    component.ngOnInit();
    expect(component.fillfields).toHaveBeenCalled();
  });

  it('deve marcar campos como touched se formulário inválido ao salvar', () => {
    component.form.controls['name'].setValue('');
    spyOn(component as any, 'validateFields').and.callThrough();
    component.saveProfile();
    expect((component as any).validateFields).toHaveBeenCalled();
    expect(component.form.controls['name'].touched).toBeTrue();
  });

  it('deve chamar updateProfile se profile existir e formulário for válido', () => {
    spyOn(component, 'updateProfile');
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.saveProfile();
    expect(component.updateProfile).toHaveBeenCalled();
  });

  it('deve chamar createProfile se profile não existir e formulário for válido', () => {
    component.profile = null;
    spyOn(component, 'createProfile');
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.saveProfile();
    expect(component.createProfile).toHaveBeenCalled();
  });

  it('deve setar alertSuccess ao criar perfil com sucesso', () => {
    component.profile = null;
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.createProfile(component.form.value);
    expect(component.alertSuccess).toContain('Alterações Salvas com sucesso');
  });

  it('deve setar alertError ao falhar em criar perfil', () => {
    mockProfileService.createProfile.and.returnValue(throwError('erro'));
    component.profile = null;
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.createProfile(component.form.value);
    expect(component.alertError).toContain('Erro ao Salvar Perfil');
  });

  it('deve setar alertSuccess ao atualizar perfil com sucesso', () => {
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.updateProfile(component.form.value);
    expect(component.alertSuccess).toContain('Alterações Salvas com sucesso');
  });

  it('deve setar alertError ao falhar em atualizar perfil', () => {
    mockProfileService.updateProfile.and.returnValue(throwError('erro'));
    component.form.controls['name'].setValue('Nome');
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['description'].setValue('desc');
    component.form.controls['city'].setValue('city');
    component.form.controls['state'].setValue('state');
    component.updateProfile(component.form.value);
    expect(component.alertError).toContain('Erro ao Salvar Perfil');
  });

});