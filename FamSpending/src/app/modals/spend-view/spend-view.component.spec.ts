import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpendViewComponent } from './spend-view.component';

describe('SpendViewComponent', () => {
  let component: SpendViewComponent;
  let fixture: ComponentFixture<SpendViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpendViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
