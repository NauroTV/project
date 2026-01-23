import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inverted } from './inverted';

describe('Inverted', () => {
  let component: Inverted;
  let fixture: ComponentFixture<Inverted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inverted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inverted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
