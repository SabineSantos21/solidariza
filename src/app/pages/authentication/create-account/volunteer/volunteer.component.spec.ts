import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VolunteerComponent } from './volunteer.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

describe('VolunteerComponent', () => {
  let component: VolunteerComponent;
  let fixture: ComponentFixture<VolunteerComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ VolunteerComponent ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LocalStorageService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário corretamente no ngOnInit', () => {
    expect(component.form).toBeDefined();
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
    expect(component.form.contains('confirmPassword')).toBeTrue();
  });

  it('deve retornar false e mensagem se confirmar senha for diferente', () => {
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('OutraSenha1!');
    const result = component.validatePassword();
    expect(result).toBeFalse();
    expect(component.alertError).toContain('As senhas não coincidem');
  });

  it('deve retornar false se campos de senha estiverem vazios', () => {
    component.form.controls['password'].setValue('');
    component.form.controls['confirmPassword'].setValue('');
    const result = component.validatePassword();
    expect(result).toBeFalse();
    expect(component.alertError).toContain('campos de senha não podem estar vazios');
  });

  it('deve retornar false e mensagem se senha for fraca', () => {
    component.form.controls['password'].setValue('senha123');
    component.form.controls['confirmPassword'].setValue('senha123');
    const result = component.validatePassword();
    expect(result).toBeFalse();
    expect(component.alertError).toContain('deve conter pelo menos 8 caracteres');
  });

  it('deve retornar true para senha válida', () => {
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');
    const result = component.validatePassword();
    expect(result).toBeTrue();
  });

  it('não deve chamar o serviço se formulário estiver inválido', () => {
    component.form.controls['name'].setValue('');
    component.createUser();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('deve chamar o serviço e navegar para login em caso de criação bem sucedida', fakeAsync(() => {
    // Configura formulário válido
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@email.com');
    component.form.controls['phone'].setValue('11999999999');
    component.form.controls['documentNumber'].setValue('12345678901');
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');

    component.checkPolicy = true;
    component.checkCookie = true;

    userServiceSpy.createUser.and.returnValue(of({}));
    component.createUser();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve exibir mensagem de erro se o serviço falhar', fakeAsync(() => {
    // Configura formulário válido
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@email.com');
    component.form.controls['phone'].setValue('11999999999');
    component.form.controls['documentNumber'].setValue('12345678901');
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');

    component.checkPolicy = true;
    component.checkCookie = true;

    userServiceSpy.createUser.and.returnValue(throwError(() => new Error('Erro de API')));
    component.createUser();
    tick();

    expect(component.alertError).toContain('Erro ao criar usuário');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});