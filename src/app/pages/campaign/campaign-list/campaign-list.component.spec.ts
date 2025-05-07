import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignListComponent } from './campaign-list.component';
import { Component } from '@angular/core';

describe('CampaignListComponent', () => {
  let component: CampaignListComponent;
  let fixture: ComponentFixture<CampaignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve aceitar valores nos inputs campaign e profile', () => {
    const mockCampaign = { id: 1, name: 'Campanha Teste' };
    const mockProfile = { id: 2, name: 'Organização Teste' };

    component.campaign = mockCampaign;
    component.profile = mockProfile;
    fixture.detectChanges();

    expect(component.campaign).toEqual(mockCampaign);
    expect(component.profile).toEqual(mockProfile);
  });

});