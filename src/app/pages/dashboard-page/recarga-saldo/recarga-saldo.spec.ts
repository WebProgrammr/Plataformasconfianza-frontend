import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargaSaldo } from './recarga-saldo';

describe('RecargaSaldo', () => {
  let component: RecargaSaldo;
  let fixture: ComponentFixture<RecargaSaldo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecargaSaldo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecargaSaldo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
