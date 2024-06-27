import { crearEntrenador } from "./entrenador.js";
let db;
const openDB=window.indexedDB.open("db_Pokedex");

openDB.onerror=(event)=>{
    console.log('error');
};

openDB.onsuccess=(event)=>{
    db=event.target.result;
    mostrar().then(lista => {
        crearEntrenador(lista);
    }).catch(error => {
        console.error('Error al mostrar los entrenadores:', error);
    });
};

openDB.onupgradeneeded=(event)=>{
    const lista=['luis','kevin','santos','cristian'];   

    const bd=event.target.result;

    const almacen=bd.createObjectStore("tbl_entrenadores",{keyPath:'id',autoIncrement:true});
    almacen.transaction.oncomplete=(event)=>{
        const datosDefecto=bd.transaction("tbl_entrenadores","readwrite").objectStore("tbl_entrenadores");
        lista.forEach(elemento=>{
            datosDefecto.add({nombre:elemento});
        });
    };
   
};

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}


function agregarNuevoEntrenador(nombreE){
    
    const transaction = db.transaction(["tbl_entrenadores"], "readwrite");
   
    transaction.oncomplete = (event) => {
        mostrar().then(lista => {
            crearEntrenador(lista);
        }).catch(error => {
            console.error('Error al mostrar los entrenadores:', error);
        });
    };
      
    transaction.onerror = (event) => {
        console.log('error');
    };

    const objectStore = transaction.objectStore("tbl_entrenadores");
    const request=objectStore.add({
        nombre:nombreE,
    });

    request.onsuccess=(event)=>{
        console.log('guardado');
    }
}


function mostrar(){
    let almacen = getObjectStore("tbl_entrenadores","readonly");
    let lista = [];

    return new Promise((resolve, reject) => {
        let puntero = almacen.openCursor();

        puntero.addEventListener("success", (e) => {
            let puntero2 = e.target.result;
            if (puntero2) {
                const objeto = {
                    nombreE: puntero2.value.nombre,
                    idE: puntero2.key
                };
                lista.push(objeto);
                puntero2.continue();
            } else {
                
                resolve(lista);
            }
        });
    });
   
}

function eliminarEntrenador(id){
    const request = db.transaction(["tbl_entrenadores"], "readwrite").objectStore("tbl_entrenadores").delete(id);
    request.onsuccess = (event) => {
        console.log('se fue');
    };
    console.log(id);
}

function modificarEntrenador(antiguo,nombreE){
    var transaccion=db.transaction(["tbl_entrenadores"],"readwrite");
    var almacen= transaccion.objectStore("tbl_entrenadores");
    
    transaccion.addEventListener("complete",()=>{
        mostrar().then(lista => {
            crearEntrenador(lista);
        }).catch(error => {
            console.error('Error al mostrar los entrenadores:', error);
        });
    });
   
    let puntero = almacen.openCursor();

    puntero.addEventListener("success", (e) => {
        let puntero2 = e.target.result;
        if (puntero2) {
            if(puntero2.value.nombre===antiguo){
                puntero2.value.nombre=nombreE;

                let objeto=puntero2.value;

                puntero2.update(objeto);
            }
            puntero2.continue();
        }
    });
}



export {agregarNuevoEntrenador,eliminarEntrenador,modificarEntrenador};

