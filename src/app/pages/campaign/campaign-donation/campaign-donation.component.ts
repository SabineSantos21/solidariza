import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PixType } from 'src/app/shared/enums/pixType';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { DonationService } from 'src/app/shared/services/donation.service';

@Component({
  selector: 'app-campaign-donation',
  templateUrl: './campaign-donation.component.html',
  styleUrls: ['./campaign-donation.component.scss']
})
export class CampaignDonationComponent implements OnInit {
  organizationInfo: any;

  campaignId: any;
  campaign: any;

  alertError: any = "";
  alertSuccess: any = "";

  textTooltip: string = "Copiar"

  constructor(
    private spinner: NgxSpinnerService,
    private donationService: DonationService,
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.campaignId = this.route.snapshot.paramMap.get("id");

    if (this.campaignId) {
      this.getDonationQrCode(this.campaignId);
    }
    else {
      this.router.navigate(["/dashboard"]);
    }
  }

  getDonationQrCode(campaignId) {
    this.spinner.show();

    this.donationService.getDonationQRCode(campaignId).subscribe(
      data => {
        this.organizationInfo = data
      },
      error => {
        this.alertError = "Erro ao buscar Qr Code"
      }
    ).add(() => {
      this.spinner.hide();
    })
  }

  getPixType(type) {
    
    switch(type) {
      case PixType.PHONE:
        return "Telefone"

      case PixType.EMAIL:
        return "Email"
      
      case PixType.CPF:
        return "CPF"
      
      case PixType.CNPJ:
        return "CNPJ"
      
      case PixType.OTHER :
        return "Outra"
        
      default:
        return "Outra"
    }
  }

  getPixKeyMask(type) {
    
    switch(type) {
      case PixType.PHONE:
        return "(00) 0000-00009"

      case PixType.EMAIL:
        return ""
      
      case PixType.CPF:
        return "000.000.000-00"
      
      case PixType.CNPJ:
        return "00.000.000/0000-00"
      
      case PixType.OTHER :
        return ""
        
      default:
        return ""
    }
  }

  copiarPix(pixKey: string) {
    if (!pixKey) return;

    navigator.clipboard.writeText(pixKey).then(() => {
      this.textTooltip = "Copiado"
    });
  }

}
