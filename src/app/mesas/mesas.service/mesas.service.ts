import { Injectable } from '@angular/core';

// import { Firestore, addDoc } from '@angular/fire/firestore';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  DocumentData,
  deleteDoc,
  onSnapshot,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import { db } from 'src/app/DB Fire Base/conexion-FireBase';
import { Platillo } from 'src/app/platillos/models/Platillo';

@Injectable({
  providedIn: 'root',
})
export class MesasService {
    public platillos : Platillo[] = [];
  //   async eliminarPlatillo(collection: string, idDoc: string) {
  //     await deleteDoc(doc(db, collection, idDoc));

  //   }

  async obtenerPlatillos() {
    // {
    //     "descripcion": "de pastor",
    //     "nombre": "tacos",
    //     "precio": 23,
    //     "carreta": 1
    // }
    this.platillos = [];
    const querySnapshot = await getDocs(collection(db, 'platillos'));
    querySnapshot.forEach((doc) => {
        let modelPlatillo = new Platillo();
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
        modelPlatillo.descripcion = doc.data()['descripcion'];
        modelPlatillo.nombre = doc.data()['nombre'];
        modelPlatillo.precio = doc.data()['precio'];
        modelPlatillo.carreta = doc.data()['carreta'];
        this.platillos.push(modelPlatillo);

    //   this.platillos.push(doc.data())
    });
    return this.platillos;
  }
}
