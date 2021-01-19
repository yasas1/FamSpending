import { TestBed } from '@angular/core/testing';

import { ViewControllerService } from './view-controller.service';

describe('ViewControllerService', () => {
  let service: ViewControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
