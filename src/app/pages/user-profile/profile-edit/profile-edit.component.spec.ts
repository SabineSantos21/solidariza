// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ProfileEditComponent } from './profile-edit.component';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { ProfileService } from 'src/app/shared/services/profile.service';
// import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
// import { of } from 'rxjs';

// describe('ProfileEditComponent', () => {
//   let component: ProfileEditComponent;
//   let fixture: ComponentFixture<ProfileEditComponent>;
//   let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
//   let profileServiceSpy: jasmine.SpyObj<ProfileService>;
//   let localStorageSpy: jasmine.SpyObj<LocalStorageService>;

//   beforeEach(async () => {
//     spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfileByUserId']);
//     localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);

//     await TestBed.configureTestingModule({
//       declarations: [ProfileEditComponent],
//       providers: [
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: ProfileService, useValue: profileServiceSpy },
//         { provide: LocalStorageService, useValue: localStorageSpy }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ProfileEditComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit deve chamar getUser', () => {
//     spyOn(component, 'getUser').and.callThrough();
//     component.ngOnInit();
//     expect(component.getUser).toHaveBeenCalled();
//   });

//   it('getUser deve buscar user no localStorage e chamar getProfileByUserId', () => {
//     localStorageSpy.get.and.returnValue({ userId: 'uxt' });
//     spyOn(component, 'getProfileByUserId').and.callThrough();
//     component.getUser();
//     expect(localStorageSpy.get).toHaveBeenCalledWith('user');
//     expect(component.getProfileByUserId).toHaveBeenCalledWith('uxt');
//   });

//   it('getProfileByUserId deve preencher profile, controlar loading e spinner', fakeAsync(() => {
//     profileServiceSpy.getProfileByUserId.and.returnValue(of({ name: 'Maria', id: 'yy' }));
//     component.getProfileByUserId('zz');
//     tick();
//     expect(spinnerSpy.show).toHaveBeenCalled();
//     expect(component.profile).toEqual({ name: 'Maria', id: 'yy' });
//     expect(component.loading).toBeTrue();
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

// });