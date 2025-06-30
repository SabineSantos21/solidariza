import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/shared/enums/userType';
import { NewUser } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit {
  form: FormGroup;
  alertError = "";
  alertSuccess = "";
  checkPolicy = null;
  checkCookie = null;

  private readonly errorMessages = {
    emptyPassword: 'Os campos de senha não podem estar vazios.',
    passwordsMismatch: 'As senhas não coincidem.',
    weakPassword: 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.',
    userCreateGeneric: 'Erro ao criar usuário'
  };

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createForm(new NewUser());
  }

  private createForm(user: NewUser): void {
    this.form = this.formBuilder.group({
      name: [user.name, Validators.required],
      type: [UserType.Donor, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      password: [user.password, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name);
  }

  private validateFields(): void {
    Object.values(this.form.controls).forEach(control => {
      if (control.invalid) control.markAsTouched();
    });
  }

  public createUser(): void {
    this.checkPolicy = this.checkPolicy ?? false;
    this.checkCookie = this.checkCookie ?? false;
    
    if (this.form.invalid) {
      this.validateFields();
      return;
    }

    if (!this.validatePassword()) return;
    if (!this.checkPolicy || !this.checkCookie) return;

    this.spinner.show();
    this.userService.createUser(this.form.value).subscribe({
      next: () => { this.router.navigate(['/login']) },
      error: (error) => {
        this.alertError = error.status === 400 ? error.error : this.errorMessages.userCreateGeneric;
      }
    }).add(() => this.spinner.hide());
  }

  private validatePassword(): boolean {
    const { password, confirmPassword } = this.form.value;
    if (!password || !confirmPassword) {
      this.setError('emptyPassword');
      return false;
    }
    if (password !== confirmPassword) {
      this.setError('passwordsMismatch');
      return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      this.setError('weakPassword');
      return false;
    }
    return true;
  }

  private setError(type: keyof typeof this.errorMessages): void {
    this.alertError = this.errorMessages[type];
  }
}