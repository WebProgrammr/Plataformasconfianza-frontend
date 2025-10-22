import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DejarResena } from './dejar-resena';

describe('DejarResena', () => {
  let component: DejarResena;
  let fixture: ComponentFixture<DejarResena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DejarResena]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DejarResena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
