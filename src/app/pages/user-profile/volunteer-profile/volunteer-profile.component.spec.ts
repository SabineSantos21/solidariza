// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { VolunteerProfileComponent } from './volunteer-profile.component';

// describe('VolunteerProfileComponent', () => {
//   let component: VolunteerProfileComponent;
//   let fixture: ComponentFixture<VolunteerProfileComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ VolunteerProfileComponent ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(VolunteerProfileComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('deve aceitar valores nos inputs user e profile', () => {
//     const mockUser = { id: 1, name: 'Voluntário', email: 'v@teste.com' };
//     const mockProfile = { id: 2, description: 'Testando' };

//     component.user = mockUser;
//     component.profile = mockProfile;
//     fixture.detectChanges();

//     expect(component.user).toEqual(mockUser);
//     expect(component.profile).toEqual(mockProfile);
//   });
// });