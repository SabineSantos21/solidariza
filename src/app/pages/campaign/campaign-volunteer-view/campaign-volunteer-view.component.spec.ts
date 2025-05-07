import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CampaignVolunteerViewComponent } from './campaign-volunteer-view.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
import { of } from 'rxjs';
import { CampaignVolunteerStatus } from 'src/app/shared/enums/campaignVolunteerStatus';

describe('CampaignVolunteerViewComponent', () => {
  let component: CampaignVolunteerViewComponent;
  let fixture: ComponentFixture<CampaignVolunteerViewComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let campaignVolunteerServiceSpy: jasmine.SpyObj<CampaignVolunteerService>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    campaignVolunteerServiceSpy = jasmine.createSpyObj('CampaignVolunteerService', [
      'getCampaignVolunteerByUserId'
    ]);

    await TestBed.configureTestingModule({
      declarations: [CampaignVolunteerViewComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: CampaignVolunteerService, useValue: campaignVolunteerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignVolunteerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar usuário no localStorage no ngOnInit', () => {
    localStorageSpy.get.and.returnValue({ userId: 888 });
    campaignVolunteerServiceSpy.getCampaignVolunteerByUserId.and.returnValue(of([]));
    component.ngOnInit();
    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
  });

  it('não deve buscar campanhas se não houver usuário', () => {
    localStorageSpy.get.and.returnValue(null);
    spyOn(component, 'getCampaignVolunteersByUserId');
    component.ngOnInit();
    expect(component.getCampaignVolunteersByUserId).not.toHaveBeenCalled();
  });

  it('getCampaignVolunteersByUserId deve buscar dados e atualizar status', fakeAsync(() => {
    const apiData = [
      { id: 1, name: 'Item 1', isApproved: CampaignVolunteerStatus.APROVED },
      { id: 2, name: 'Item 2', isApproved: CampaignVolunteerStatus.NOT_APROVED },
      { id: 3, name: 'Item 3', isApproved: CampaignVolunteerStatus.PENDING }
    ];
    campaignVolunteerServiceSpy.getCampaignVolunteerByUserId.and.returnValue(of(apiData));

    component.getCampaignVolunteersByUserId('meuId');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(component.campaignsVolunteer.length).toBe(3);

    // Checa se o status dos itens está correto
    expect(component.campaignsVolunteer[0].status.label).toBe('Aprovado');
    expect(component.campaignsVolunteer[1].status.label).toBe('Não Aprovado');
    expect(component.campaignsVolunteer[2].status.label).toBe('Aguardando Aprovação');

    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getStatus deve retornar label e cor corretos por status', () => {
    expect(component.getStatus(CampaignVolunteerStatus.APROVED))
      .toEqual({ label: "Aprovado", color: "text-success" });
    expect(component.getStatus(CampaignVolunteerStatus.NOT_APROVED))
      .toEqual({ label: "Não Aprovado", color: "text-danger" });
    expect(component.getStatus(CampaignVolunteerStatus.PENDING))
      .toEqual({ label: "Aguardando Aprovação", color: "text-default" });
  });

});