import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/shared/models/login';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  alertError: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.createFormObject(new Login());
  }

  private createFormObject(login: Login) {
    this.form = this.formBuilder.group({
      email: new FormControl(login.email, Validators.required),
      password: new FormControl(login.password, Validators.required)
    });
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  private validateFields() {
    Object.keys(this.form.controls).forEach((key) => {
      if (
        this.getControl(key).value == "" ||
        this.getControl(key).value == null
      )
        this.getControl(key).markAsTouched();
    });
  }

  login(){  
    if(this.form.invalid){
      this.validateFields();
    } else{
      this.loginService.login(this.form.value).subscribe(
        (data) => {    
          this.localStorageService.set("token", data.token);
          this.localStorageService.set("user", data.user);
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          this.alertError = "Erro ao realizar login. Confira se as suas credenciais estão corretas."
        }
      ).add(() => {});
    }
  }

}
