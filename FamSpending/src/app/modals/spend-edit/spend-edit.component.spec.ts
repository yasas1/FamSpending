import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpendEditComponent } from './spend-edit.component';

describe('SpendEditComponent', () => {
  let component: SpendEditComponent;
  let fixture: ComponentFixture<SpendEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpendEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
