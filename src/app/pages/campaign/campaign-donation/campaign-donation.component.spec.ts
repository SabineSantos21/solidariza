import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CampaignDonationComponent } from "./campaign-donation.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { DonationService } from "src/app/shared/services/donation.service";
import { CampaignService } from "src/app/shared/services/campaign.service";
import { OrganizationInfoService } from "src/app/shared/services/organizationInfo.service";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import * as QRCode from "qrcode";
import { PixType } from "src/app/shared/enums/pixType";
import { PixUtils } from "src/app/shared/services/pix-utils.service";
import { NgxMaskModule } from "ngx-mask";

describe("CampaignDonationComponent", () => {
  let component: CampaignDonationComponent;
  let fixture: ComponentFixture<CampaignDonationComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let donationServiceSpy: jasmine.SpyObj<DonationService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let organizationInfoServiceSpy: jasmine.SpyObj<OrganizationInfoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj("NgxSpinnerService", ["show", "hide"]);
    donationServiceSpy = {} as jasmine.SpyObj<DonationService>;
    campaignServiceSpy = jasmine.createSpyObj("CampaignService", ["getCampaignById"]);
    organizationInfoServiceSpy = jasmine.createSpyObj("OrganizationInfoService", ["getOrganizationInfoByUserId"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => "123",
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [CampaignDonationComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DonationService, useValue: donationServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: OrganizationInfoService, useValue: organizationInfoServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes([]), NgxMaskModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignDonationComponent);
    component = fixture.componentInstance;

    component.qrCanvas = {
      nativeElement: document.createElement("canvas"),
    } as ElementRef;

    campaignServiceSpy.getCampaignById.and.returnValue(of({ userId: "abc123" }));
    organizationInfoServiceSpy.getOrganizationInfoByUserId.and.returnValue(
      of({
        organizationInfoId: "org-001",
        pixKey: "5511987654321",
        beneficiaryName: "INSTITUTO VIDA NOVA",
        beneficiaryCity: "SAO PAULO",
      })
    );

    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve carregar campanha e organização no ngOnInit", () => {
    expect(campaignServiceSpy.getCampaignById).toHaveBeenCalledWith("123");
    expect(organizationInfoServiceSpy.getOrganizationInfoByUserId).toHaveBeenCalledWith("abc123");
    expect(component.organizationInfo).toBeTruthy();
    expect(component.qrCodePixPayload).toContain("INSTITUTO VIDA NOVA");
  });

  it("deve retornar a descrição correta do tipo PIX", () => {
    expect(component.getPixType(PixType.PHONE)).toBe("Telefone");
    expect(component.getPixType(PixType.EMAIL)).toBe("Email");
    expect(component.getPixType(PixType.CPF)).toBe("CPF");
    expect(component.getPixType(PixType.CNPJ)).toBe("CNPJ");
    expect(component.getPixType(PixType.OTHER)).toBe("Outra");
    expect(component.getPixType("desconhecido")).toBe("Outra");
  });

  it("deve retornar a máscara correta do tipo PIX", () => {
    expect(component.getPixKeyMask(PixType.PHONE)).toBe("(00) 0000-00009");
    expect(component.getPixKeyMask(PixType.EMAIL)).toBe("");
    expect(component.getPixKeyMask(PixType.CPF)).toBe("000.000.000-00");
    expect(component.getPixKeyMask(PixType.CNPJ)).toBe("00.000.000/0000-00");
    expect(component.getPixKeyMask(PixType.OTHER)).toBe("");
    expect(component.getPixKeyMask("nada")).toBe("");
  });

  it("deve copiar o pix para a área de transferência", async () => {
    const clipboardSpy = spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());
    await component.copiarPix("123456");
    expect(clipboardSpy).toHaveBeenCalledWith("123456");
    expect(component.textTooltip).toBe("Copiado");
  });
});
