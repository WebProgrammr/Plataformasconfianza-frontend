import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { distributorGuard } from './distributor-guard';

describe('distributorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => distributorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
