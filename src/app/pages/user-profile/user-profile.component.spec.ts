import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { CampaignService } from 'src/app/shared/services/campaign.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

enum UserType {
  Organization = 'Organization',
  Donor = 'Donor',
  Volunteer = 'Volunteer'
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let campaignServiceSpy: jasmine.SpyObj<CampaignService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfileByUserId']);
    campaignServiceSpy = jasmine.createSpyObj('CampaignService', ['getCampaignByUserId']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '990' // default userId
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: CampaignService, useValue: campaignServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('userId presente, igual ao user.userId: showEditUser = true, busca user/profile', fakeAsync(() => {
      localStorageSpy.get.and.returnValue({ userId: '990', type: UserType.Donor });
      userServiceSpy.getUserById.and.returnValue(of({ userId: '990', type: UserType.Donor }));
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));
      component.ngOnInit();
      tick();
      expect(component.showEditUser).toBeTrue();
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('990');
      expect(userServiceSpy.getUserById).toHaveBeenCalledWith('990');
    }));

    it('userId presente, diferente do user.userId: showEditUser = false, busca user/profile', fakeAsync(() => {
      localStorageSpy.get.and.returnValue({ userId: 'ORIG', type: UserType.Donor });
      userServiceSpy.getUserById.and.returnValue(of({ userId: '990', type: UserType.Donor }));
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));
      component.ngOnInit();
      tick();
      expect(component.showEditUser).toBeFalse();
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('990');
      expect(userServiceSpy.getUserById).toHaveBeenCalledWith('990');
    }));

    it('não tem userId, mas tem user: showEditUser = true, busca somente o profile', fakeAsync(() => {
      activatedRouteMock.snapshot.paramMap.get = () => null;
      localStorageSpy.get.and.returnValue({ userId: '51', type: UserType.Volunteer });
      profileServiceSpy.getProfileByUserId.and.returnValue(of({}));
      component.ngOnInit();
      tick();
      expect(component.showEditUser).toBeTrue();
      expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('51');
    }));

    it('não tem user nem userId: redireciona para /login', () => {
      activatedRouteMock.snapshot.paramMap.get = () => null;
      localStorageSpy.get.and.returnValue(null);
      component.ngOnInit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  it('getProfileByUserId popula profile e busca campanhas se user Organization', fakeAsync(() => {
    component.user = { userId: '1', type: UserType.Organization };
    profileServiceSpy.getProfileByUserId.and.returnValue(of({}));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['camp']));
    component.getProfileByUserId('1');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(profileServiceSpy.getProfileByUserId).toHaveBeenCalledWith('1');
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('1');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getUserById popula user e busca campanhas se user Organization', fakeAsync(() => {
    userServiceSpy.getUserById.and.returnValue(of({ userId: '5', type: UserType.Organization }));
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['C']));

    component.getUserById('5');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('5');
    expect(component.user.userId).toBe('5');
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('5');
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

  it('getCampaignByUserId popula campaigns e spinner', fakeAsync(() => {
    campaignServiceSpy.getCampaignByUserId.and.returnValue(of(['A', 'B']));
    component.getCampaignByUserId('12');
    tick();
    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(campaignServiceSpy.getCampaignByUserId).toHaveBeenCalledWith('12');
    expect(component.campaigns).toEqual(['A', 'B']);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));
});
