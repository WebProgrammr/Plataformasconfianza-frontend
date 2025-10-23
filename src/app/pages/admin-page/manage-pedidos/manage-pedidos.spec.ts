import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePedidos } from './manage-pedidos';

describe('ManagePedidos', () => {
  let component: ManagePedidos;
  let fixture: ComponentFixture<ManagePedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
