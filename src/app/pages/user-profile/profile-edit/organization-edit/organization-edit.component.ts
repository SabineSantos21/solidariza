import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LinkType } from 'src/app/shared/enums/linkType';
import { NewLink } from 'src/app/shared/models/link';
import { NewProfile, UpdateProfile } from 'src/app/shared/models/profile';
import { LinkService } from 'src/app/shared/services/link.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.scss']
})
export class OrganizationEditComponent implements OnInit {
  @Input() user;
  @Input() profile;

  form: FormGroup;

  options: any = [];
  selectedOption?: any = null;
  link: any = null;
  isDropdownOpen = false;

  links: any = [];

  alertError: any = "";
  alertSuccess: any = "";

  constructor(
    public profileService: ProfileService,
    public formBuilder: FormBuilder,
    public linkService: LinkService
  ) { }

  ngOnInit(): void {
    this.createForm(new UpdateProfile())
    this.fillFieldsByUser();

    if (this.profile) {
      this.fillfields();
      this.getLinks();
    }
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

  fillFieldsByUser() {
    this.getControl("name").setValue(this.user.name);
    this.getControl("phone").setValue(this.user.phone);

    this.getControl("email").setValue(this.user.email);
    this.getControl("email").disabled
  }

  fillfields() {
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
    else if (this.profile) {
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

  addLink() {
    var link: NewLink = new NewLink({
      profileId: this.profile.profileId,
      type: this.selectedOption.id,
      url: this.link
    })

    if (link.profileId && link.type && link.url) {
      this.linkService.createLink(link).subscribe(
        data => {
          this.links.push(data);

          this.link = null;
          this.selectedOption = null;
        },
        error => {
          this.alertError = "Erro ao adicionar link. Tente novamente."
        }
      )

    }
  }

  getLinks() {
    this.linkService.getLinksByProfileId(this.profile.profileId).subscribe(
      data => {
        this.links = data;
      },
      error => {
        this.alertError = "Erro ao buscar links. Tente novamente mais tarde."
      }
    )
  }

  removeLink(link) {
    this.linkService.deleteLink(link.linkId).subscribe(
      data => {
        this.getLinks()
      },
      error => {
        this.alertError = "Erro ao buscar Links. Tente novamente."
      }
    )
  }

  getSocialIcon(linkType) {

    switch (linkType) {
      case LinkType.INSTAGRAM:
        return '../../../../assets/img/icons/social/instagram.svg';

      case LinkType.FACEBOOK:
        return '../../../../assets/img/icons/social/facebook.svg'

      case LinkType.LINKEDIN:
        return '../../../../assets/img/icons/social/linkedin.svg';

      case LinkType.TIKTOK:
        return '../../../../assets/img/icons/social/tiktok.svg';

      case LinkType.WHATSAPP:
        return '../../../../assets/img/icons/social/whatsapp.svg';

      case LinkType.YOUTUBE:
        return '../../../../assets/img/icons/social/youtube.svg';

      case LinkType.OTHER:
        return '../../../../assets/img/icons/social/link.svg';

      default:
        break
    }

  }
  
  getLinkIcons() {
    this.options = [
      { id: LinkType.INSTAGRAM, name: 'Instagram', image: '../../../../assets/img/icons/social/instagram.svg' },
      { id: LinkType.FACEBOOK, name: 'Facebook', image: '../../../../assets/img/icons/social/facebook.svg' },
      { id: LinkType.LINKEDIN, name: 'LinkedIn', image: '../../../../assets/img/icons/social/linkedin.svg' },
      { id: LinkType.TIKTOK, name: 'TikTok', image: '../../../../assets/img/icons/social/tiktok.svg' },
      { id: LinkType.WHATSAPP, name: 'Whatsapp', image: '../../../../assets/img/icons/social/whatsapp.svg' },
      { id: LinkType.YOUTUBE, name: 'YouTube', image: '../../../../assets/img/icons/social/youtube.svg' },
      { id: LinkType.OTHER, name: 'Outro', image: '../../../../assets/img/icons/social/link.svg' },
    ];
  }
}
