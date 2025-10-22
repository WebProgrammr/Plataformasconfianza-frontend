import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorCommissions } from './distributor-commissions';

describe('DistributorCommissions', () => {
  let component: DistributorCommissions;
  let fixture: ComponentFixture<DistributorCommissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributorCommissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorCommissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
