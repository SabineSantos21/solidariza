import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserType } from 'src/app/shared/enums/userType';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfileByUserId']);
    profileServiceSpy.getProfileByUserId.and.returnValue(of({})); // <-- Padrão
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignByUserId']);
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of([])); // <-- Padrão
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    userServiceSpy.getUserById.and.returnValue(of({})); // <-- Padrão
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '11'
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - ID passado por rota', () => {
    it('com userId igual do usuário logado: showEditUser true, busca dados user/profile', fakeAsync(() => {
      // Simula user no localStorage igual ao da rota
      const userMock = { userId: '11', type: UserType.Donor };
      localStorageSpy.get.and.returnValue(userMock);
      userServiceSpy.getUserById.and.returnValue(of(userMock));
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));
  
      component.ngOnInit();
      tick();
  
      expect(component.showEditUser).toBeTrue();
      expect(userServiceSpy.getUserById).toHaveBeenCalledWith('11');
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('11');
    }));

    it('com userId diferente do logado: showEditUser false, busca user/profile', fakeAsync(() => {
      localStorageSpy.get.and.returnValue({ userId: 'ABCD', type: UserType.Donor });
      const otherUser = { userId: '11', type: UserType.Donor };
      activatedRouteMock.snapshot.paramMap.get = () => '11';
      userServiceSpy.getUserById.and.returnValue(of(otherUser));
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));

      component.ngOnInit();
      tick();

      expect(component.showEditUser).toBeFalse();
      expect(userServiceSpy.getUserById).toHaveBeenCalledWith('11');
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('11');
    }));
  });

  describe('ngOnInit - Sem id na rota', () => {
    it('com user logado: showEditUser true, busca profile', fakeAsync(() => {
      activatedRouteMock.snapshot.paramMap.get = () => null;
      const loggedUser = { userId: '187', type: UserType.Donor };
      localStorageSpy.get.and.returnValue(loggedUser);
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));

      component.ngOnInit();
      tick();

      expect(component.showEditUser).toBeTrue();
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('187');
    }));

    it('sem user logado: redireciona para login', () => {
      activatedRouteMock.snapshot.paramMap.get = () => null;
      localStorageSpy.get.and.returnValue(null);

      component.ngOnInit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  it('getProfileByUserId deve popular profile e buscar campanhas se Organization', fakeAsync(() => {
    const userMock = { userId: '5', type: UserType.Organization };
    component.user = userMock;
    const profileMock = { id: 'PR5', org: true };
    profileServiceSpy.getProfileByUserId.and.returnValue(of(profileMock));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['camp1', 'camp2']));

    component.getProfileByUserId('5');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('5');
    expect(component.profile).toEqual(profileMock);
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('5');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getUserById deve popular user e buscar campanhas se Organization', fakeAsync(() => {
    const userMock = { userId: 'X7', type: UserType.Organization };
    userServiceSpy.getUserById.and.returnValue(of(userMock));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['c1']));

    component.getUserById('X7');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('X7');
    expect(component.user).toEqual(userMock);
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('X7');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignByUserId deve popular campaigns', fakeAsync(() => {
    const dataMock = ['A', 'B'];
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(dataMock));
    component.getCampaignByUserId('42');
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('42');
    expect(component.campaigns).toEqual(dataMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});