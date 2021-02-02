import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DaySpendingsManagePage } from './day-spendings-manage.page';

describe('DaySpendingsManagePage', () => {
  let component: DaySpendingsManagePage;
  let fixture: ComponentFixture<DaySpendingsManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaySpendingsManagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DaySpendingsManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
