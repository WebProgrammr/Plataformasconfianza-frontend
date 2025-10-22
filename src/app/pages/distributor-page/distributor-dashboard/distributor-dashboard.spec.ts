import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorDashboard } from './distributor-dashboard';

describe('DistributorDashboard', () => {
  let component: DistributorDashboard;
  let fixture: ComponentFixture<DistributorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
