import { crearEntrenador } from "./entrenador.js";
import { rellenoDiv } from "./administracionPokemones.js";
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

    mostrarPokemones().then(lista => {
        rellenoDiv(lista);
    }).catch(error => {
        console.error('Error al mostrar los pokemones:', error);
    });

};

openDB.onupgradeneeded=(event)=>{
    const lista=['luis','kevin','santos','cristian'];   

    const bd=event.target.result;

    const almacen=bd.createObjectStore("tbl_entrenadores",{keyPath:'id',autoIncrement:true});
    const alamcen2=bd.createObjectStore("tbl_pokemones",{keyPath:'id'});
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
    const cuenta=objectStore.count();
    cuenta.onsuccess=(event)=>{
        let registros=cuenta.result;

        if (registros<6) {
            const request=objectStore.add({
                nombre:nombreE,
            });
        
            request.onsuccess=(event)=>{
                
            }
        }
        else{
            Swal.fire({
                title: "Maximo permitido!",
                text: "Ya no puedes crear mas entrenadores!",
                icon: "error"
            });
        }
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


function eliminarEntrenador(idE){
    const transaction=db.transaction(["tbl_entrenadores"],"readwrite");

    transaction.oncomplete=(event)=>{
        mostrar().then(lista => {
            crearEntrenador(lista);
        }).catch(error => {
            console.error('Error al mostrar los entrenadores:', error);
        });
    };

    const almacen=transaction.objectStore(["tbl_entrenadores"]);
    let request=almacen.delete(Number(idE));
    request.onsuccess=(event)=>{
        
    };

    request.onerror = (event) => {
        console.error("Error al intentar eliminar el registro:", event.target.error);
    };
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

function agregarPokemon(pokemon,idP){
    const transaction = db.transaction(["tbl_pokemones"], "readwrite");
   
    transaction.oncomplete = (event) => {
        mostrarPokemones().then(lista => {
            rellenoDiv(lista);
        }).catch(error => {
            console.error('Error al mostrar los pokemones:', error);
        });
    };
      
    transaction.onerror = (event) => {
        console.log('error');
    };

    const objectStore = transaction.objectStore("tbl_pokemones");
    const cuenta=objectStore.count();
    cuenta.onsuccess=(event)=>{
        let registros=cuenta.result;

        if (registros<6) {
            const registro={
                id:idP,
                value:pokemon,
            }
            const request=objectStore.add(registro);
        
            request.onsuccess=(event)=>{
                
            }
        }
        else{
            Swal.fire({
                title: "Maximo permitido!",
                text: "Ya no seleccionar mas pokemones",
                icon: "error"
            });
        }
    }
}

function mostrarPokemones(){
    let almacen = getObjectStore("tbl_pokemones","readonly");
    let lista = [];

    return new Promise((resolve, reject) => {
        let puntero = almacen.openCursor();

        puntero.addEventListener("success", (e) => {
            let puntero2 = e.target.result;
            if (puntero2) {
                const objeto = {
                    estadisticas: puntero2.value,
                    idP: puntero2.key
                };
                lista.push(objeto);
                puntero2.continue();
            } else {
                
                resolve(lista);
            }
        });
    });
}


function eliminarPokemon(idP){
    const transaction=db.transaction(["tbl_pokemones"],"readwrite");

    transaction.oncomplete=(event)=>{
        mostrarPokemones().then(lista => {
            rellenoDiv(lista);
        }).catch(error => {
            console.error('Error al mostrar los pokemones:', error);
        });
    };

    const almacen=transaction.objectStore(["tbl_pokemones"]);
    let request=almacen.delete(Number(idP));
    request.onsuccess=(event)=>{
        
    };

    request.onerror = (event) => {
        console.error("Error al intentar eliminar el registro:", event.target.error);
    };
}

function verificarExistencia(idP){
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["tbl_pokemones"], "readonly");
        const almacen = transaction.objectStore("tbl_pokemones");
        let request = almacen.get(Number(idP));

        request.onsuccess = (event) => {
            if (request.result) {
                console.log('encontrado');
                resolve(true);
            } else {
                console.log('no encontrado');
                resolve(false);
            }
        };
    });
}



export {agregarNuevoEntrenador,eliminarEntrenador,modificarEntrenador,agregarPokemon,eliminarPokemon,verificarExistencia};

