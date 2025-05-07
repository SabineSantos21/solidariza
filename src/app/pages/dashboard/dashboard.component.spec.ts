import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { of } from 'rxjs';
import { UserType } from 'src/app/shared/enums/userType';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', [
      'getCampaignByUserId',
      'getCampaigns'
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: CampaignService, useValue: campaignServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getCampaignByUserId se for Organization', fakeAsync(() => {
    const orgUser = { userId: 222, type: UserType.Organization };
    const campaignsMock = [{ id: 1 }, { id: 2 }];
    localStorageSpy.get.and.returnValue(orgUser);
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(campaignsMock));

    component.ngOnInit();
    tick();

    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith(222);
    expect(component.campaigns).toEqual(campaignsMock);
    expect(component.campaignsList).toEqual(campaignsMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('deve chamar getCampaigns se não for Organization', fakeAsync(() => {
    const otherUser = { userId: 12, type: UserType.Donor };
    const campaignsMock = [{ id: 5 }, { id: 6 }];
    localStorageSpy.get.and.returnValue(otherUser);
    campaignServiceSpy.getCampaigns.and.returnValue(of(campaignsMock));

    component.ngOnInit();
    tick();

    expect(localStorageSpy.get).toHaveBeenCalledWith('user');
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaigns).toHaveBeenCalled();
    expect(component.campaigns).toEqual(campaignsMock);
    expect(component.campaignsList).toEqual(campaignsMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignByUserId deve preencher campaigns e campaignsList', fakeAsync(() => {
    const dataMock = [{ id: 99 }];
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(dataMock));

    component.getCampaignByUserId('334');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('334');
    expect(component.campaigns).toEqual(dataMock);
    expect(component.campaignsList).toEqual(dataMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaigns deve preencher campaigns e campaignsList', fakeAsync(() => {
    const dataMock = [{ id: 42 }];
    campaignServiceSpy.getCampaigns.and.returnValue(of(dataMock));

    component.getCampaigns();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaigns).toHaveBeenCalled();
    expect(component.campaigns).toEqual(dataMock);
    expect(component.campaignsList).toEqual(dataMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('filterByUserName deve filtrar corretamente (case insensitive)', () => {
    const input = [
      { user: { name: 'ONG LAPAS' } },
      { user: { name: 'Projeto Roda' } },
      { user: { name: 'ONG HOPE' } }
    ];
    const result = component.filterByUserName(input, 'ong');
    expect(result.length).toBe(2);
    expect(result[0].user.name).toBe('ONG LAPAS');
    expect(result[1].user.name).toBe('ONG HOPE');
  });

  it('filterCampaigns deve atualizar campaignsList conforme filtro', () => {
    const dataMock = [
      { user: { name: 'Nome 1' } },
      { user: { name: 'Outro Nome' } },
    ];
    component.campaigns = dataMock;
    component.search = 'Outro';
    component.filterCampaigns();
    expect(component.campaignsList.length).toBe(1);
    expect(component.campaignsList[0].user.name).toBe('Outro Nome');
  });

});