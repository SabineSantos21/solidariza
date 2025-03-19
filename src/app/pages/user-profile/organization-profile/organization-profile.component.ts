import { Component, Input, OnInit } from '@angular/core';
import { LinkType } from 'src/app/shared/enums/linkType';
import { LinkService } from 'src/app/shared/services/link.service';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {
  @Input() user;
  @Input() profile;

  links: any = [];
  socialAccounts: any = [];
  
  otherLinks: any = [];
  showLinks: boolean = false;

  alertError: any = "";
  alertSuccess: any = "";

  constructor(
    public linkService: LinkService
  ) { }

  ngOnInit(): void {
    if (this.profile) {
      this.getLinks();
    }
  }

  getLinks() {
    this.linkService.getLinksByProfileId(this.profile.profileId).subscribe(
      data => {
        this.links = data;

        this.links.forEach(el => {
          this.getSocialAccounts(el)
        });

      },
      error => {
        this.alertError = "Erro ao buscar links. Tente novamente mais tarde."
      }
    )
  }

  getSocialAccounts(link) {
    switch (link.type) {
      case LinkType.INSTAGRAM:
        this.socialAccounts.push({
          type: LinkType.INSTAGRAM,
          icon: '../../../../assets/img/icons/social/instagram.svg', 
          link: link.url
        })
        break;

      case LinkType.FACEBOOK:
        this.socialAccounts.push({
          type: LinkType.FACEBOOK,
          icon: '../../../../assets/img/icons/social/facebook.svg', 
          link: link.url
        })
        break;

      case LinkType.LINKEDIN:
        this.socialAccounts.push({
          type: LinkType.LINKEDIN,
          icon: '../../../../assets/img/icons/social/linkedin.svg', 
          link: link.url
        })
        break;

      case LinkType.TIKTOK:
        this.socialAccounts.push({
          type: LinkType.TIKTOK,
          icon: '../../../../assets/img/icons/social/tiktok.svg', 
          link: link.url
        })
        break;

      case LinkType.WHATSAPP:
        this.socialAccounts.push({
          type: LinkType.WHATSAPP,
          icon: '../../../../assets/img/icons/social/whatsapp.svg', 
          link: link.url
        })
        break;

      case LinkType.YOUTUBE:
        this.socialAccounts.push({
          type: LinkType.YOUTUBE,
          icon: '../../../../assets/img/icons/social/youtube.svg', 
          link: link.url
        })
        break;

      case LinkType.OTHER:
        this.otherLinks.push({
          type: LinkType.OTHER,
          icon: '../../../../assets/img/icons/social/link.svg', 
          link: link.url
        })

      default:
        break
    }
  }

  toggleShowLinks() {
    this.showLinks = !this.showLinks;
  }

}
