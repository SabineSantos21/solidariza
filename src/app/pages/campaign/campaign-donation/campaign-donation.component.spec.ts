import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignDonationComponent } from './campaign-donation.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService } from 'src/app/shared/services/donation.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { of, throwError } from 'rxjs';
import { PixType } from 'src/app/shared/enums/pixType';
import { RouterTestingModule } from '@angular/router/testing';

describe('CampaignDonationComponent', () => {
  let component: CampaignDonationComponent;
  let fixture: ComponentFixture<CampaignDonationComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let donationServiceSpy: jasmine.SpyObj<DonationService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    donationServiceSpy = jasmine.createSpyObj('DonationService', ['getDonationQRCode']);
    donationServiceSpy.getDonationQRCode.and.returnValue(of({})); 
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['dummy']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '123'
        }
      }
    };
  
    await TestBed.configureTestingModule({
      declarations: [ CampaignDonationComponent ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: DonationService, useValue: donationServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [ RouterTestingModule ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(CampaignDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar QRCode se houver campaignId', fakeAsync(() => {
    const responseMock = { key: 'pixKey', type: PixType.EMAIL };
    donationServiceSpy.getDonationQRCode.and.returnValue(of(responseMock));
    component.ngOnInit();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(donationServiceSpy.getDonationQRCode).toHaveBeenCalledWith('123');
    expect(component.organizationInfo).toEqual(responseMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve redirecionar para /dashboard se não houver campaignId', () => {
    activatedRouteMock.snapshot.paramMap.get = () => null; // Simula ID ausente
    fixture = TestBed.createComponent(CampaignDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve exibir mensagem de erro ao falhar na busca do QR Code', fakeAsync(() => {
    donationServiceSpy.getDonationQRCode.and.returnValue(throwError(() => new Error('Erro')));
    component.getDonationQrCode('123');
    tick();

    expect(component.alertError).toContain('Erro ao buscar Qr Code');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getPixType deve retornar as strings corretas', () => {
    expect(component.getPixType(PixType.PHONE)).toBe('Telefone');
    expect(component.getPixType(PixType.EMAIL)).toBe('Email');
    expect(component.getPixType(PixType.CPF)).toBe('CPF');
    expect(component.getPixType(PixType.CNPJ)).toBe('CNPJ');
    expect(component.getPixType(PixType.OTHER)).toBe('Outra');
    expect(component.getPixType('qualquer')).toBe('Outra');
  });

  it('getPixKeyMask deve retornar as máscaras corretas', () => {
    expect(component.getPixKeyMask(PixType.PHONE)).toBe('(00) 0000-00009');
    expect(component.getPixKeyMask(PixType.CPF)).toBe('000.000.000-00');
    expect(component.getPixKeyMask(PixType.CNPJ)).toBe('00.000.000/0000-00');
    expect(component.getPixKeyMask(PixType.EMAIL)).toBe('');
    expect(component.getPixKeyMask(PixType.OTHER)).toBe('');
    expect(component.getPixKeyMask('qualquer')).toBe('');
  });
});