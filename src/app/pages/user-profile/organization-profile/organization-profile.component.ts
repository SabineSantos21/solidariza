import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { LinkType } from "src/app/shared/enums/linkType";
import { CampaignService } from "src/app/shared/services/campaign.service";
import { LinkService } from "src/app/shared/services/link.service";
import { OrganizationInfoService } from "src/app/shared/services/organizationInfo.service";

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {
  @Input() user;
  @Input() profile;
  @Input() showEditUser;

  links: any[] = [];
  socialAccounts: any[] = [];
  campaigns: any[] = [];
  otherLinks: any[] = [];
  organizationInfo: any;

  showLinks = false;
  alertError = '';
  alertSuccess = '';

  private readonly socialIconMap = {
    [LinkType.INSTAGRAM]: 'instagram.svg',
    [LinkType.FACEBOOK]: 'facebook.svg',
    [LinkType.LINKEDIN]: 'linkedin.svg',
    [LinkType.TIKTOK]: 'tiktok.svg',
    [LinkType.WHATSAPP]: 'whatsapp.svg',
    [LinkType.YOUTUBE]: 'youtube.svg'
  };
  private readonly linkIconPath = '../../../../assets/img/icons/social/';
  private readonly genericError = 'Tente novamente mais tarde.';

  constructor(
    public spinner: NgxSpinnerService,
    public linkService: LinkService,
    public campaignService: CampaignService,
    public organizationInfoService: OrganizationInfoService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.profile) {
      let userId = this.route.snapshot.paramMap.get('id');
      if (userId) this.user.userId = userId;

      this.getOrganizationInfo(this.user.userId);
      this.getLinks();
    }
  }

  private handleAsync<T>(obs, onSuccess, onError?) {
    this.spinner.show();
    obs.subscribe(
      onSuccess,
      err => {
        if (onError) { onError(err); }
      }
    ).add(() => this.spinner.hide());
  }

  getOrganizationInfo(userId: string) {
    this.organizationInfoService.getOrganizationInfoByUserId(userId).subscribe({
      next: data => {
      if (data && data.organizationInfoId) {
        this.organizationInfo = data;
      } else {
        this.organizationInfo = null;
      }
      },
      error: () => { this.alertError = 'Erro ao buscar informações da empresa. ' + this.genericError; }
    });
  }

  validateOrganization(organizationInfoId, cnpj) {
    this.handleAsync(
      this.organizationInfoService.organizationInfoValidateByOrganizationInfoId(
        organizationInfoId, this.removeSpecialCharacters(cnpj)
      ),
      data => this.organizationInfo = data,
      () => { this.alertError = 'Erro ao validar empresa. ' + this.genericError }
    );
  }

  removeSpecialCharacters(str: string): string {
    return str.replace(/[^a-zA-Z0-9 ]/g, "");
  }

  getLinks() {
    this.linkService.getLinksByProfileId(this.profile.profileId).subscribe({
      next: (data) => {
        this.links = data || [];
        this.organizeLinks();
      },
      error: () => { this.alertError = 'Erro ao buscar links. ' + this.genericError }
    });
  }

  private organizeLinks() {
    this.socialAccounts = [];
    this.otherLinks = [];
    (this.links || []).forEach(link => {
      if (this.socialIconMap[link.type]) {
        this.socialAccounts.push({
          type: link.type,
          icon: this.linkIconPath + this.socialIconMap[link.type],
          link: link.url
        });
      } else if (link.type === LinkType.OTHER) {
        this.otherLinks.push({
          type: LinkType.OTHER,
          icon: this.linkIconPath + this.socialIconMap[LinkType.OTHER] || 'link.svg',
          link: link.url
        });
      }
    });
  }

  toggleShowLinks() {
    this.showLinks = !this.showLinks;
  }

  getCampaignsByUserId() {
    this.handleAsync(
      this.campaignService.getCampaignByUserId(this.user.userId),
      data => this.campaigns = data || []
    );
  }
}