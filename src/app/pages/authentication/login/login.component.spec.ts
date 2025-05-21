import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { LoginService } from "src/app/shared/services/login.service";
import { LocalStorageService } from "src/app/shared/services/local-storage.service";
import { throwError } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj("LoginService", ["login"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    spinnerSpy = jasmine.createSpyObj("NgxSpinnerService", ["show", "hide"]);
    localStorageSpy = jasmine.createSpyObj("LocalStorageService", ["set"]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve inicializar o formulário corretamente", () => {
    expect(component.form).toBeDefined();
    expect(component.form.contains("email")).toBeTrue();
    expect(component.form.contains("password")).toBeTrue();
  });

  it("não deve fazer login se o formulário for inválido", () => {
    component.form.controls["email"].setValue("");
    component.form.controls["password"].setValue("");
    component.login();
    expect(loginServiceSpy.login).not.toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro caso as credenciais estejam erradas", fakeAsync(() => {
    component.form.controls["email"].setValue("naoexiste@email.com");
    component.form.controls["password"].setValue("senhaErrada123");
    const mockError = { status: 401 };

    loginServiceSpy.login.and.returnValue(throwError(() => mockError));
    component.login();
    tick();

    expect(component.alertError).toContain("Erro ao realizar login");
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));
});
