import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignViewComponent } from './campaign-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { of, throwError } from 'rxjs';

// IMPORTAÇÕES QUE RESOLVEM SEUS ERROS:
import { RouterTestingModule } from '@angular/router/testing';
import { NgxMaskModule } from 'ngx-mask'; // ou NgxMaskPipe/provideNgxMask (caso sua versão precise)

describe('CampaignViewComponent', () => {
  let component: CampaignViewComponent;
  let fixture: ComponentFixture<CampaignViewComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignById']);
    campaignServiceSpy.getCampaignById.and.returnValue(of({}));  // <-- Retorno padrão pro subscribe nunca ser undefined
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
  
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '42' // valor padrão para campaign id
        }
      }
    };
  
    await TestBed.configureTestingModule({
      declarations: [ CampaignViewComponent ],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: LocalStorageService, useValue: localStorageSpy }
      ],
      imports: [
        RouterTestingModule,
        NgxMaskModule.forRoot() // Isso resolve o erro do pipe 'mask'
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(CampaignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar user e campanha por id ao inicializar', fakeAsync(() => {
    localStorageSpy.get.and.returnValue({ id: 1, name: 'Usuário Teste' });
    const campaignMock = { id: '42', name: 'Campanha Teste' };
    campaignServiceSpy.getCampaignById.and.returnValue(of(campaignMock));
    
    component.ngOnInit();
    tick();

    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignById).toHaveBeenCalledWith('42');
    expect(component.campaign).toEqual(campaignMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve redirecionar para /dashboard se não houver id', () => {
    activatedRouteMock.snapshot.paramMap.get = () => null; // Simula ausência de id
    fixture = TestBed.createComponent(CampaignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve exibir mensagem de erro se não encontrar a campanha', fakeAsync(() => {
    localStorageSpy.get.and.returnValue({ id: 1, name: 'Usuário Teste' });
    campaignServiceSpy.getCampaignById.and.returnValue(throwError(() => new Error('Erro API')));

    component.getCampaignById('42');
    tick();

    expect(component.alertError).toContain('Erro ao buscar campanha');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});