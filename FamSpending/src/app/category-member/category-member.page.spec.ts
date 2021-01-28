import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryMemberPage } from './category-member.page';

describe('CategoryMemberPage', () => {
  let component: CategoryMemberPage;
  let fixture: ComponentFixture<CategoryMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
