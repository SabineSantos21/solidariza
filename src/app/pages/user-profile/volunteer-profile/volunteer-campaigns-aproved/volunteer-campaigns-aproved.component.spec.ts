// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { VolunteerCampaignsAprovedComponent } from './volunteer-campaigns-aproved.component';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { CampaignVolunteerService } from 'src/app/shared/services/campaignVolunteer.service';
// import { of } from 'rxjs';

// describe('VolunteerCampaignsAprovedComponent', () => {
//   let component: VolunteerCampaignsAprovedComponent;
//   let fixture: ComponentFixture<VolunteerCampaignsAprovedComponent>;
//   let spinnerSpy: jasmine.SpyObj<NgxSpinnerService>;
//   let campaignVolunteerServiceSpy: jasmine.SpyObj<CampaignVolunteerService>;

//   beforeEach(async () => {
//     spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
//     campaignVolunteerServiceSpy = jasmine.createSpyObj('CampaignVolunteerService', [
//       'getCampaignVolunteerByUserIdAndAproved'
//     ]);

//     await TestBed.configureTestingModule({
//       declarations: [VolunteerCampaignsAprovedComponent],
//       providers: [
//         { provide: NgxSpinnerService, useValue: spinnerSpy },
//         { provide: CampaignVolunteerService, useValue: campaignVolunteerServiceSpy }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(VolunteerCampaignsAprovedComponent);
//     component = fixture.componentInstance;
//     // Necessário atribuir manualmente já que o template não o faz
//     component.profile = { userId: 'vol1' };
//     fixture.detectChanges();
//   });

//   it('deve criar o componente', () => {
//     expect(component).toBeTruthy();
//   });

//   it('ngOnInit deve chamar getCampaignsVolunteerByUserIdAndAproved com o userId correto', () => {
//     spyOn(component, 'getCampaignsVolunteerByUserIdAndAproved').and.callThrough();
//     component.profile = { userId: 'vol123' };
//     component.ngOnInit();
//     expect(component.getCampaignsVolunteerByUserIdAndAproved).toHaveBeenCalledWith('vol123');
//   });

//   it('getCampaignsVolunteerByUserIdAndAproved deve popular campaigns e controlar spinner', fakeAsync(() => {
//     const mockData = [{ id: 1, name: 'Campanha Teste' }];
//     campaignVolunteerServiceSpy.getCampaignVolunteerByUserIdAndAproved.and.returnValue(of(mockData));
//     component.getCampaignsVolunteerByUserIdAndAproved('vol1');
//     tick();
//     expect(spinnerSpy.show).toHaveBeenCalled();
//     expect(campaignVolunteerServiceSpy.getCampaignVolunteerByUserIdAndAproved).toHaveBeenCalledWith('vol1');
//     expect(component.campaigns).toEqual(mockData);
//     expect(spinnerSpy.hide).toHaveBeenCalled();
//   }));

// });