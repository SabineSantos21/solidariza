import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewProfile, UpdateProfile } from 'src/app/shared/models/profile';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;

  user: any;
  profile: any;

  alertError: any = "";
  alertSuccess: any = "";

  options: any = [];
  selectedOption?: any = null;
  isDropdownOpen = false;
  
  constructor(
    public profileService: ProfileService,
    public formBuilder: FormBuilder,
    public localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.createForm(new UpdateProfile())
    this.getUser();
    this.getLinkIcons();
  }

  getProfileByUserId(userId) {
    this.profileService.getProfileByUserId(userId).subscribe(
      data => {
        this.profile = data;

        if(this.profile) {
          this.fillfields()
        }
        
      }
    )
  }

  getUser() {
    this.user = this.localStorageService.get("user");

    this.getControl("name").setValue(this.user.name);
    this.getControl("phone").setValue(this.user.phone);
    
    this.getControl("email").setValue(this.user.email);
    this.getControl("email").disabled

    this.getProfileByUserId(this.user.userId)
  }

  getLinkIcons() {
    this.options = [
      { id: 1, name: 'Instagram', image: '../../../../assets/img/icons/social/instagram.svg' },
      { id: 2, name: 'Facebook', image: '../../../../assets/img/icons/social/facebook.svg' },
      { id: 3, name: 'LinkedIn', image: '../../../../assets/img/icons/social/linkedin.svg' },
      { id: 4, name: 'TikTok', image: '../../../../assets/img/icons/social/tiktok.svg' },
      { id: 5, name: 'Whatsapp', image: '../../../../assets/img/icons/social/whatsapp.svg' },
      { id: 6, name: 'YouTube', image: '../../../../assets/img/icons/social/youtube.svg' },
    ];
  }

  addLink() {

  }

  public createForm(profile) {
    this.form = this.formBuilder.group({
      name: new FormControl(profile.name, Validators.required),
      email: new FormControl(null, Validators.required),
      address: new FormControl(profile.address, Validators.required),
      city: new FormControl(profile.city, Validators.required),
      state: new FormControl(profile.state, Validators.required),
      zip: new FormControl(profile.zip, Validators.required),
      phone: new FormControl(profile.phone, Validators.required),
      description: new FormControl(profile.description, Validators.required)
    })
  }

  fillfields(){
    this.getControl("name").setValue(this.profile.name);
    this.getControl("address").setValue(this.profile.address);
    this.getControl("city").setValue(this.profile.city);
    this.getControl("state").setValue(this.profile.state);
    this.getControl("zip").setValue(this.profile.zip);
    this.getControl("phone").setValue(this.profile.phone);
    this.getControl("description").setValue(this.profile.description); 
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
    else if(this.profile) {
      this.updateProfile(this.form.value)
    }
    else {
      this.createProfile(this.form.value)
    }
  }

  createProfile(profile) {
    var newProfile = new NewProfile(profile);
    newProfile.userId = this.user.userId;

    this.profileService.createProfile(newProfile).subscribe(
      data => {
        this.alertSuccess = "Alterações Salvas com sucesso"
      },
      error => {
        this.alertError = "Erro ao Salvar Perfil"
      }
    )
  }

  updateProfile(profile) {
    this.profileService.updateProfile(this.profile.profileId, profile).subscribe(
      data => {
        this.alertSuccess = "Alterações Salvas com sucesso"
      },
      error => {
        this.alertError = "Erro ao Salvar Perfil"
      }
    )
  }

}
