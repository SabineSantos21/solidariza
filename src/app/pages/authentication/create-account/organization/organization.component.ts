import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentType } from 'src/app/shared/enums/documentType';
import { UserType } from 'src/app/shared/enums/userType';
import { NewUser } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  form: FormGroup;
  alertError: any = "";
  alertSuccess: any = "";

  checkPolicy = null;
  checkCookie = null;

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.createForm(new NewUser())
  }

  public createForm(user: NewUser) {
    this.form = this.formBuilder.group({
      name: new FormControl(user.name, Validators.required),
      documentType: new FormControl(DocumentType.CNPJ, Validators.required),
      documentNumber: new FormControl(user.documentNumber, Validators.required),
      type: new FormControl(UserType.Organization, Validators.required),
      email: new FormControl(user.email, Validators.required),
      phone: new FormControl(user.phone, Validators.required),
      contactName: new FormControl(user.contactName, Validators.required),
      contactPhone: new FormControl(user.contactPhone, Validators.required),
      password: new FormControl(user.password, Validators.required),
      confirmPassword: new FormControl(null, Validators.required)
    })
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

  public createUser() {
    this.checkPolicy = this.checkPolicy ?? false;
    this.checkCookie = this.checkCookie ?? false;

    if (this.form.invalid) {
      this.validateFields();
    }
    else if (this.checkPolicy && this.checkCookie && this.validatePassword()) {
      this.spinner.show();

      let user = this.form.value;

      this.userService.createUser(user).subscribe({
        next: (data) => { this.router.navigate(["/login"]) },
        error: (error) => {
          this.alertError = error.error ?? "Erro ao criar conta. Confira se os dados estão corretos.";
        }
      }).add(() => {
        this.spinner.hide();
      })
    }
  }

  validatePassword() {
    let password = this.form.value.password;
    let confirmPassword = this.form.value.confirmPassword;

    if (!password || !confirmPassword) {
      this.alertError = 'Os campos de senha não podem estar vazios.';
      return false;
    }

    if (password !== confirmPassword) {
      this.alertError = 'As senhas não coincidem.';
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      this.alertError = 'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.';
      return false;
    }

    return true;
  }

}
