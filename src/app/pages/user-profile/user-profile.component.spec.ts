import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockSpinner: any;
  let mockLocalStorage: any;
  let mockProfileService: any;
  let mockCampaignService: any;
  let mockUserService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockSpinner = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    mockLocalStorage = { get: jasmine.createSpy('get') };
    mockProfileService = { getProfileByUserId: jasmine.createSpy('getProfileByUserId') };
    mockCampaignService = { getCampaignByUserId: jasmine.createSpy('getCampaignByUserId') };
    mockUserService = { getUserById: jasmine.createSpy('getUserById') };
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    mockActivatedRoute = {
      snapshot: { paramMap: { get: jasmine.createSpy('get') } }
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: LocalStorageService, useValue: mockLocalStorage },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: CampaignService, useValue: mockCampaignService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('deve mostrar perfil editável se userId == user.userId', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('99');
      mockLocalStorage.get.and.returnValue({ userId: 99, type: 1 });

      spyOn(component, 'getUserById');
      spyOn(component, 'getProfileByUserId');

      component.ngOnInit();
      expect(component.showEditUser).toBeTrue();
      expect(component.getUserById).toHaveBeenCalledWith('99');
      expect(component.getProfileByUserId).toHaveBeenCalledWith('99');
    });

    it('deve mostrar perfil não editável se userId != user.userId', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('100');
      mockLocalStorage.get.and.returnValue({ userId: 1, type: 1 });

      spyOn(component, 'getUserById');
      spyOn(component, 'getProfileByUserId');

      component.ngOnInit();
      expect(component.showEditUser).toBeFalse();
      expect(component.getUserById).toHaveBeenCalledWith('100');
      expect(component.getProfileByUserId).toHaveBeenCalledWith('100');
    });

    it('deve buscar perfil do usuário do localStorage se não houver userId', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      mockLocalStorage.get.and.returnValue({ userId: 5, type: 1 });

      spyOn(component, 'getProfileByUserId');

      component.ngOnInit();
      expect(component.showEditUser).toBeTrue();
      expect(component.getProfileByUserId).toHaveBeenCalledWith(5);
    });

    it('deve redirecionar para login se não houver userId nem usuário local', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      mockLocalStorage.get.and.returnValue(null);

      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getProfileByUserId()', () => {
    beforeEach(() => {
      component.user = { userId: 42, type: 2 }; // type: 2 != Organization
      mockProfileService.getProfileByUserId.and.returnValue(of({ nome: 'Profile Test' }));
    });

    it('deve buscar e setar profile e esconder spinner', () => {
      component.getProfileByUserId(42);
      expect(mockSpinner.show).toHaveBeenCalled();
      expect(mockProfileService.getProfileByUserId).toHaveBeenCalledWith(42);
      expect(component.profile).toEqual({ nome: 'Profile Test' });
      expect(mockSpinner.hide).toHaveBeenCalled();
    });

    it('deve chamar getCampaignByUserId se usuario for Organization', () => {
      // type: 1 (Organization)
      component.user = { userId: 88, type: 1 };

      mockProfileService.getProfileByUserId.and.returnValue(of({ nome: 'Profile Org' }));
      spyOn(component, 'getCampaignByUserId');

      component.getProfileByUserId(88);
      expect(component.getCampaignByUserId).toHaveBeenCalledWith(88);
    });
  });

  describe('getUserById()', () => {
    beforeEach(() => {
      mockUserService.getUserById.and.returnValue(of({ userId: 70, type: 2 }));
      component.user = null;
    });

    it('deve buscar usuário, setar user e esconder spinner', () => {
      component.getUserById(70);
      expect(mockSpinner.show).toHaveBeenCalled();
      expect(mockUserService.getUserById).toHaveBeenCalledWith(70);
      expect(component.user).toEqual({ userId: 70, type: 2 });
      expect(mockSpinner.hide).toHaveBeenCalled();
    });

    it('deve chamar getCampaignByUserId se usuario for Organization', () => {
      mockUserService.getUserById.and.returnValue(of({ userId: 71, type: 1 }));
      spyOn(component, 'getCampaignByUserId');
      component.getUserById(71);
      expect(component.getCampaignByUserId).toHaveBeenCalledWith(71);
    });
  });

  describe('getCampaignByUserId()', () => {
    beforeEach(() => {
      mockCampaignService.getCampaignByUserId.and.returnValue(of([{ id: 1, title: 'C1' }]));
    });

    it('deve buscar campanhas e setar campaigns', () => {
      component.getCampaignByUserId(10);
      expect(mockSpinner.show).toHaveBeenCalled();
      expect(mockCampaignService.getCampaignByUserId).toHaveBeenCalledWith(10);
      expect(component.campaigns).toEqual([{ id: 1, title: 'C1' }]);
      expect(mockSpinner.hide).toHaveBeenCalled();
    });
  });
});