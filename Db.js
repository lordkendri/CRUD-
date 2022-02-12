//Inicio de creacion de base de datos

"use strict";

const IDBRequest = indexedDB.open("KDatabase",1);

IDBRequest.addEventListener("upgradeneeded",()=>{
    const db = IDBRequest.result;
    db.createObjectStore("names",{
        autoIncrement: true
    });
});

IDBRequest.addEventListener("success",()=>{
    console.log("todo salio correctamente");
});
IDBRequest.addEventListener("error",()=>{
    console.log("Error al abrir la base de datos");
});

const addObjetos = objeto =>{
    const IDBData = getIDBData("readwrite","objeto agregado correctamente");
    IDBData.add(objeto);
};

const leerObjetos = () =>{
    const IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            console.log(cursor.result.value);
            cursor.result.continue();
        }else console.log("Todos los datos fueron leidos");
    });
};

const modificarObjetos = (key,objeto) =>{
    const IDBData = getIDBData("readwrite","objeto modificado correctamente");
    IDBData.put(objeto, key);
};

const eliminarObjetos = key =>{
    const IDBData = getIDBData("readwrite","objeto eliminado correctamente");
    IDBData.delete(key);
};

const getIDBData = (mode, msg) =>{
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction("names", mode);
    const objectStore = IDBtransaction.objectStore("names");
    IDBtransaction.addEventListener("complete",()=>{
        console.log(msg)
    });
    return objectStore;
};

//Fin de creacion de base de datos