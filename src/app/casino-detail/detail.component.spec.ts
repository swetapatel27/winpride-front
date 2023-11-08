import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoDetailComponent } from './detail.component';

describe('CasinoDetailComponent', () => {
  let component: CasinoDetailComponent;
  let fixture: ComponentFixture<CasinoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
