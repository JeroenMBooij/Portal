import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeScrollComponent } from './three-scroll.component';

describe('ThreeScrollComponent', () => {
  let component: ThreeScrollComponent;
  let fixture: ComponentFixture<ThreeScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
