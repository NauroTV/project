import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BildEdit } from './bild-edit';

describe('BildEdit', () => {
  let component: BildEdit;
  let fixture: ComponentFixture<BildEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BildEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BildEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
