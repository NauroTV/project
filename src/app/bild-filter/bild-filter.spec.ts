import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BildFilter } from './bild-filter';

describe('BildFilter', () => {
  let component: BildFilter;
  let fixture: ComponentFixture<BildFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BildFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BildFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
