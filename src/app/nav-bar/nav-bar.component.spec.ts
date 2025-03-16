import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { Router } from '@angular/router';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate when clicking nav buttons', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const path = '/authors';

    component.navigateTo(path);
    expect(navigateSpy).toHaveBeenCalledWith([path]);
  });

  it('should handle user menu click', () => {
    const consoleSpy = spyOn(console, 'log');
    
    component.handleUserMenu();
    expect(consoleSpy).toHaveBeenCalledWith('User menu clicked');
  });
});