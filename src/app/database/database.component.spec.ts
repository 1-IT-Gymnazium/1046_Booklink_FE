import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseComponent } from './database.component';

describe('RealEstateComponent', () => {
  let component: DatabaseComponent;
  let fixture: ComponentFixture<DatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
