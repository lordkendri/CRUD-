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
    leerObjetos();
});
IDBRequest.addEventListener("error",()=>{
    console.log("Error al abrir la base de datos");
});

document.getElementById('add').addEventListener("click",()=>{
    let name = document.getElementById("name").value;
    if(name.length > 0){
        if(document.querySelector(".posible") != undefined){
            if(confirm("Hay elementos sin guardar || Quiere continuar sin guardar?")){
                addObjetos({name});
                leerObjetos();
            }   
        }else{
                addObjetos({name});
                leerObjetos();
            
        };
    };
});

const addObjetos = objeto =>{
    const IDBData = getIDBData("readwrite","objeto agregado correctamente");
    IDBData.add(objeto);
};

const leerObjetos = () =>{
    const IDBData = getIDBData("readonly");
    const cursor = IDBData.openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".names").innerHTML = "";
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            let elemento = namesHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento);
            cursor.result.continue();
        }else document.querySelector(".names").appendChild(fragment);
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

const namesHTML = (id,name)=>{
    const container = document.createElement("DIV");
    const h2 = document.createElement("H2");
    const options = document.createElement("DIV");
    const saveButton = document.createElement("BUTTON");
    const deleteButton = document.createElement("BUTTON");

    container.classList.add("name");
    options.classList.add("options");
    saveButton.classList.add("imposible");
    deleteButton.classList.add("delete");

    saveButton.textContent = "Guardar";
    deleteButton.textContent = "Eliminar";
    
    h2.textContent = name.name;
    h2.setAttribute("contenteditable",true);
    h2.setAttribute("spellcheck",false);


    options.appendChild(saveButton);
    options.appendChild(deleteButton);

    container.appendChild(h2);
    container.appendChild(options);

    h2.addEventListener("keyup",()=>{
        saveButton.classList.replace("imposible","posible")
    });

    saveButton.addEventListener("click",()=>{
        if(saveButton.className == "posible"){
            modificarObjetos(id,{name: h2.textContent});
            saveButton.classList.replace("posible","imposible");
        }
    });

    deleteButton.addEventListener("click",()=>{
           eliminarObjetos(id);
           document.querySelector(".names").removeChild(container);

    });
    return container;
}