import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSpendingPage } from './new-spending.page';

describe('NewSpendingPage', () => {
  let component: NewSpendingPage;
  let fixture: ComponentFixture<NewSpendingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSpendingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSpendingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
