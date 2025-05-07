import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationComponent } from './organization.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { of } from 'rxjs';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;
  let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;

  beforeEach(async () => {
    spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    profileServiceSpy = jasmine.createSpyObj('ProfileService', ['getProfileOrganization']);

    await TestBed.configureTestingModule({
      declarations: [OrganizationComponent],
      providers: [
        { provide: NgxSpinnerService, useValue: spinnerSpy },
        { provide: ProfileService, useValue: profileServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar getOrganizations no ngOnInit', () => {
    spyOn(component, 'getOrganizations');
    component.ngOnInit();
    expect(component.getOrganizations).toHaveBeenCalled();
  });

  it('getOrganizations deve preencher o array organizations e controlar o spinner', fakeAsync(() => {
    const orgsMock = [
      { id: 1, name: 'ONG 1' },
      { id: 2, name: 'ONG 2' }
    ];
    profileServiceSpy.getProfileOrganization.and.returnValue(of(orgsMock));
    component.getOrganizations();
    tick();

    expect(spinnerSpy.show).toHaveBeenCalled();
    expect(profileServiceSpy.getProfileOrganization).toHaveBeenCalled();
    expect(component.organizations).toEqual(orgsMock);
    expect(spinnerSpy.hide).toHaveBeenCalled();
  }));

});