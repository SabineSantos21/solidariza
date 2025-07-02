import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { PixType } from "src/app/shared/enums/pixType";
import { CampaignService } from "src/app/shared/services/campaign.service";
import { DonationService } from "src/app/shared/services/donation.service";
import { OrganizationInfoService } from "src/app/shared/services/organizationInfo.service";
import { PixUtils } from "src/app/shared/services/pix-utils.service";
import * as QRCode from "qrcode";

@Component({
  selector: "app-campaign-donation",
  templateUrl: "./campaign-donation.component.html",
  styleUrls: ["./campaign-donation.component.scss"],
})
export class CampaignDonationComponent implements OnInit {
  @ViewChild("qrCanvas", { static: false }) qrCanvas!: ElementRef;

  organizationInfo: any;

  campaignId: any;
  campaign: any;

  alertError: any = "";
  alertSuccess: any = "";

  textTooltip: string = "Copiar";
  qrCodePixPayload: string = "";

  constructor(
    private readonly spinner: NgxSpinnerService,
    private readonly donationService: DonationService,
    private readonly campaignService: CampaignService,
    private readonly organizationInfoService: OrganizationInfoService,
    private readonly route: ActivatedRoute,
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");

    if (this.campaignId) {
      this.getCampaignById();
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }

  getCampaignById() {
    this.spinner.show();

    this.campaignService.getCampaignById(this.campaignId).subscribe({
        next: (data) => {
          this.campaign = data;
          this.getOrganizationInfo(this.campaign.userId);
        },
        error: (error) => {}
      })
      .add(() => {
        this.spinner.hide();
      });
  }

  getOrganizationInfo(userId: string) {
    this.organizationInfoService.getOrganizationInfoByUserId(userId).subscribe({
      next: (data) => {
        if (data && data.organizationInfoId) {
          this.organizationInfo = data;
          this.gerarQRCode(this.organizationInfo);
        } else {
          this.organizationInfo = null;
        }
      },
      error: () => {
        this.alertError = "Erro ao buscar informações da empresa. ";
      },
    });
  }

  gerarQRCode(organization): void {
    const sanitizedPixKey = organization.pixKey.replace(/\D/g, "");

    const payloadPix = PixUtils.gerarPayloadPix(
      sanitizedPixKey,
      organization.beneficiaryName,
      organization.beneficiaryCity,
      0
    );
    this.qrCodePixPayload = payloadPix;

    setTimeout(() => {
      if (this.qrCanvas) {
        QRCode.toCanvas(
          this.qrCanvas.nativeElement,
          payloadPix,
          {
            errorCorrectionLevel: "M",
            width: 256,
          },
          (error) => {
            if (error) console.error("Erro ao gerar QR Code:", error);
          }
        );
      }
    }, 0);
  }

  getPixType(type) {
    switch (type) {
      case PixType.PHONE:
        return "Telefone";

      case PixType.EMAIL:
        return "Email";

      case PixType.CPF:
        return "CPF";

      case PixType.CNPJ:
        return "CNPJ";

      case PixType.OTHER:
        return "Outra";

      default:
        return "Outra";
    }
  }

  getPixKeyMask(type) {
    switch (type) {
      case PixType.PHONE:
        return "(00) 0000-00009";

      case PixType.EMAIL:
        return "";

      case PixType.CPF:
        return "000.000.000-00";

      case PixType.CNPJ:
        return "00.000.000/0000-00";

      case PixType.OTHER:
        return "";

      default:
        return "";
    }
  }

  copiarPix(pixKey: string) {
    if (!pixKey) return;

    navigator.clipboard.writeText(pixKey).then(() => {
      this.textTooltip = "Copiado";
    });
  }
}
