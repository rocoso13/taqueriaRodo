import { Injectable } from '@angular/core';
// import { Firestore, addDoc } from '@angular/fire/firestore';
import { app, db } from '../DB Fire Base/conexion-FireBase';
import { Platillo } from '../platillos/models/Platillo';
import { collection, doc, setDoc, getDoc, getDocs, DocumentData } from 'firebase/firestore';
import { Mesa } from '../agregar-mesas/models/agregarMesa';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  constructor() {}

  async agregarPlatillo(platillo: Platillo) {
    const citiesRef = collection(db, 'platillos');
    console.log(platillo);
    console.log('hola');
    // const platilloRef = collection(this.firesTore, 'platillos');
    // return addDoc(platilloRef, platillo);
    await setDoc(doc(citiesRef), {
      nombre: 'taco',
      descripcion: 'algo',
      precio: 20,
    });
  }

  
}
