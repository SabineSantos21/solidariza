import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationCampaignComponent } from './organization-campaign.component';

describe('OrganizationCampaignComponent', () => {
  let component: OrganizationCampaignComponent;
  let fixture: ComponentFixture<OrganizationCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCampaignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve aceitar valores nos inputs campaign, profile e showEditUser', () => {
    const mockCampaign = { id: 1, title: 'Campanha Teste' };
    const mockProfile = { id: 9, name: 'ONG Esperança' };
    const mockShowEditUser = true;

    component.campaign = mockCampaign;
    component.profile = mockProfile;
    component.showEditUser = mockShowEditUser;

    fixture.detectChanges();

    expect(component.campaign).toEqual(mockCampaign);
    expect(component.profile).toEqual(mockProfile);
    expect(component.showEditUser).toBeTrue();
  });
});