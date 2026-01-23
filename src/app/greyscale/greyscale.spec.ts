import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Greyscale } from './greyscale';

describe('Greyscale', () => {
  let component: Greyscale;
  let fixture: ComponentFixture<Greyscale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Greyscale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Greyscale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
