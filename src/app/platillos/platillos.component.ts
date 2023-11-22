import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeticionesService } from '../services/peticiones.service';

@Component({
  selector: 'app-platillos',
  templateUrl: './platillos.component.html',
  styleUrls: ['./platillos.component.css']
})
export class PlatillosComponent {
  platilloForm: FormGroup;

  constructor(private fb: FormBuilder, private peticionesService : PeticionesService) {
    this.platilloForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required],
      // Agrega carreta e imagen según tus necesidades
    });
  }

  async guardarPlatillo() {
    // Lógica para guardar el platillo
    console.log(this.platilloForm.value);
    // Aquí puedes agregar la lógica para enviar los datos al servidor o realizar otras acciones
    const response = await this.peticionesService.agregarPlatillo(this.platilloForm.value);
    console.log(response)
  }

}
