import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sepia } from './sepia';

describe('Sepia', () => {
  let component: Sepia;
  let fixture: ComponentFixture<Sepia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sepia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sepia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
