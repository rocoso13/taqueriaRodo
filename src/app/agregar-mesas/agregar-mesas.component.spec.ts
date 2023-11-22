import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMesasComponent } from './agregar-mesas.component';

describe('AgregarMesasComponent', () => {
  let component: AgregarMesasComponent;
  let fixture: ComponentFixture<AgregarMesasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarMesasComponent]
    });
    fixture = TestBed.createComponent(AgregarMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
