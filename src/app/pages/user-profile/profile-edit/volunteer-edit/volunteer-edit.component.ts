import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewProfile, UpdateProfile } from 'src/app/shared/models/profile';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-volunteer-edit',
  templateUrl: './volunteer-edit.component.html',
  styleUrls: ['./volunteer-edit.component.scss']
})
export class VolunteerEditComponent implements OnInit {
  @Input() user;
  @Input() profile;

  form: FormGroup;

  alertError: any = "";
  alertSuccess: any = "";

  constructor(
    private readonly spinner: NgxSpinnerService,
    public profileService: ProfileService,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createForm(new UpdateProfile())
    this.fillFieldsByUser();

    if(this.profile) {
      this.fillfields();
    }
  }

  public createForm(profile) {
    this.form = this.formBuilder.group({
      name: new FormControl(profile.name, Validators.required),
      email: new FormControl(profile.email, Validators.required),
      phone: new FormControl(profile.phone, null),
      description: new FormControl(profile.description, Validators.required),
      city: new FormControl(profile.city, Validators.required),
      state: new FormControl(profile.state, Validators.required),
    })
  }

  fillFieldsByUser() {
    this.getControl("name").setValue(this.user.name);
    
    this.getControl("email").setValue(this.user.email);
    this.getControl("email").disabled
  }

  fillfields() {
    this.getControl("name").setValue(this.profile.name);
    this.getControl("phone").setValue(this.profile.phone);
    this.getControl("description").setValue(this.profile.description);
    this.getControl("city").setValue(this.profile.city);
    this.getControl("state").setValue(this.profile.state);
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

  saveProfile() {
    if (this.form.invalid) {
      this.validateFields();
    }
    else if (this.profile) {
      this.updateProfile(this.form.value)
    }
    else {
      this.createProfile(this.form.value)
    }
  }

  createProfile(profile) {
    this.spinner.show();

    let newProfile = new NewProfile(profile);
    newProfile.userId = this.user.userId;

    this.profileService.createProfile(newProfile).subscribe(
      data => {
        this.alertSuccess = "Alterações Salvas com sucesso"
      },
      error => {
        this.alertError = "Erro ao Salvar Perfil"
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  updateProfile(profile) {
    this.spinner.show();

    this.profileService.updateProfile(this.profile.profileId, profile).subscribe(
      data => {
        this.alertSuccess = "Alterações Salvas com sucesso"
      },
      error => {
        this.alertError = "Erro ao Salvar Perfil"
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

}
