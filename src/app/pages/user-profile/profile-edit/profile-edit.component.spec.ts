import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileEditComponent } from './profile-edit.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;
  let mockSpinner: any;
  let mockProfileService: any;
  let mockLocalStorageService: any;

  beforeEach(async () => {
    mockSpinner = { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    mockProfileService = {
      getProfileByUserId: jasmine.createSpy('getProfileByUserId').and.returnValue(of({ id: 1, name: 'UserProfile' }))
    };
    mockLocalStorageService = {
      get: jasmine.createSpy('get').and.returnValue({ userId: 42, name: 'TestUser' })
    };

    await TestBed.configureTestingModule({
      declarations: [ProfileEditComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: mockSpinner },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getUser no ngOnInit', () => {
    spyOn(component, 'getUser').and.callThrough();
    component.ngOnInit();
    expect(component.getUser).toHaveBeenCalled();
  });

  it('deve popular user e chamar getProfileByUserId em getUser', () => {
    spyOn(component, 'getProfileByUserId').and.callThrough();
    component.getUser();
    expect(component.user).toEqual({ userId: 42, name: 'TestUser' });
    expect(component.getProfileByUserId).toHaveBeenCalledWith(42);
  });

  it('deve buscar perfil pelo userId e definir profile e loading', () => {
    component.getProfileByUserId(42);
    expect(mockSpinner.show).toHaveBeenCalled();
    expect(mockProfileService.getProfileByUserId).toHaveBeenCalledWith(42);
    expect(component.profile).toEqual({ id: 1, name: 'UserProfile' });
    expect(component.loading).toBeTrue();
    expect(mockSpinner.hide).toHaveBeenCalled();
  });
});