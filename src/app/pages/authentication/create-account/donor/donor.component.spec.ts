import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DonorComponent } from './donor.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DonorComponent', () => {
  let component: DonorComponent;
  let fixture: ComponentFixture<DonorComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ DonorComponent ],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário corretamente', () => {
    expect(component.form).toBeDefined();
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
    expect(component.form.contains('confirmPassword')).toBeTrue();
  });

  it('deve marcar controles inválidos como tocados ao validar campos', () => {
    spyOn(component.form.controls['name'], 'markAsTouched');
    component.form.controls['name'].setValue('');
    component['validateFields']();
    expect(component.form.controls['name'].markAsTouched).toHaveBeenCalled();
  });

  it('deve retornar false e setar mensagem clara se senhas forem diferentes', () => {
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('OutraSenha!1');
    const result = component['validatePassword']();
    expect(result).toBeFalse();
    expect(component.alertError).toBe('As senhas não coincidem.');
  });

  it('deve retornar false e setar mensagem se campos de senha estiverem vazios', () => {
    component.form.controls['password'].setValue('');
    component.form.controls['confirmPassword'].setValue('');
    const result = component['validatePassword']();
    expect(result).toBeFalse();
    expect(component.alertError).toBe('Os campos de senha não podem estar vazios.');
  });

  it('deve retornar false e setar mensagem se senha for fraca', () => {
    component.form.controls['password'].setValue('senha123');
    component.form.controls['confirmPassword'].setValue('senha123');
    const result = component['validatePassword']();
    expect(result).toBeFalse();
    expect(component.alertError).toBe('A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.');
  });

  it('deve retornar true para senha válida', () => {
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');
    const result = component['validatePassword']();
    expect(result).toBeTrue();
  });

  it('não deve chamar o serviço se o formulário estiver inválido', () => {
    component.form.controls['name'].setValue('');
    component.createUser();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('não deve chamar spinner nem serviço se senha não for válida', () => {
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@email.com');
    component.form.controls['password'].setValue('diferente123A!');
    component.form.controls['confirmPassword'].setValue('outraSenha321B!');
    component.checkPolicy = true;
    component.checkCookie = true;

    spyOn(component as any, "validatePassword").and.returnValue(false);
    component.createUser();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
    expect(spinnerSpy.show).not.toHaveBeenCalled();
  });

  it('não deve submeter se checkPolicy ou checkCookie forem false', () => {
    // Preenche o form corretamente
    component.form.controls['name'].setValue('Teste');
    component.form.controls['email'].setValue('teste@email.com');
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');

    // senha válida
    spyOn(component as any, "validatePassword").and.returnValue(true);

    component.checkPolicy = false;
    component.checkCookie = true;
    component.createUser();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();

    component.checkPolicy = true;
    component.checkCookie = false;
    component.createUser();
    expect(userServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('deve chamar o serviço e navegar para login em caso de sucesso com checkboxes marcados', fakeAsync(() => {
    // Preenche o form corretamente
    component.form.controls['name'].setValue('Doador Teste');
    component.form.controls['email'].setValue('doador@email.com');
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

  it('deve exibir mensagem de erro se o serviço retornar 400', fakeAsync(() => {
    component.form.controls['name'].setValue('Doador Teste');
    component.form.controls['email'].setValue('doador@email.com');
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');
    component.checkPolicy = true;
    component.checkCookie = true;

    userServiceSpy.createUser.and.returnValue(throwError(() => ({ status: 400, error: 'Email já em uso' })));
    component.createUser();
    tick();

    expect(component.alertError).toBe('Email já em uso');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve exibir mensagem genérica se o serviço retornar outro erro', fakeAsync(() => {
    component.form.controls['name'].setValue('Doador Teste');
    component.form.controls['email'].setValue('doador@email.com');
    component.form.controls['password'].setValue('Senha123!');
    component.form.controls['confirmPassword'].setValue('Senha123!');
    component.checkPolicy = true;
    component.checkCookie = true;

    userServiceSpy.createUser.and.returnValue(throwError(() => ({ status: 500, error: 'Erro desconhecido' })));
    component.createUser();
    tick();

    expect(component.alertError).toBe('Erro ao criar usuário');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getControl deve retornar o controle correto', () => {
    expect(component.getControl('name')).toBe(component.form.controls['name']);
  });
});