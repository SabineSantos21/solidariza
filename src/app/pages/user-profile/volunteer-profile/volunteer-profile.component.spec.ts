import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolunteerProfileComponent } from './volunteer-profile.component';
import { Pipe, PipeTransform } from '@angular/core';

// Mock pipe mask
@Pipe({ name: 'mask' })
class MockMaskPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VolunteerProfileComponent', () => {
  let component: VolunteerProfileComponent;
  let fixture: ComponentFixture<VolunteerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VolunteerProfileComponent,
        MockMaskPipe // Adicione aqui
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve aceitar e armazenar o input user', () => {
    const mockUser = { id: 1, nome: 'Voluntário' };
    component.user = mockUser;
    fixture.detectChanges();
    expect(component.user).toEqual(mockUser);
  });

  it('deve aceitar e armazenar o input profile', () => {
    const mockProfile = { id: 2, cidade: 'São Paulo' };
    component.profile = mockProfile;
    fixture.detectChanges();
    expect(component.profile).toEqual(mockProfile);
  });

  it('deve chamar ngOnInit sem erro', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});