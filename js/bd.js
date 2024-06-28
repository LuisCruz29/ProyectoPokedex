import { crearEntrenador } from "./entrenador.js";
import { rellenoDiv,mostrarPokemonesAsignados } from "./administracionPokemones.js";
let db;
const openDB=window.indexedDB.open("db_Pokedex");


openDB.onerror=(event)=>{
    console.log('error');
};

openDB.onsuccess=(event)=>{
    db=event.target.result;
    mostrar().then(lista=>{
        crearEntrenador(lista);
    });
   
    
    mostrarPokemones().then(lista=>{
        rellenoDiv(lista);
    });
  
   mostrarAsignacines();
};

openDB.onupgradeneeded=(event)=>{
    const lista=['luis','kevin','santos','cristian'];   

    const bd=event.target.result;

    if(!bd.objectStoreNames.contains("tbl_entrenadores")){
        const almacen=bd.createObjectStore("tbl_entrenadores",{keyPath:'id',autoIncrement:true});
        almacen.transaction.oncomplete=(event)=>{
            const datosDefecto=bd.transaction("tbl_entrenadores","readwrite").objectStore("tbl_entrenadores");
            lista.forEach(elemento=>{
                datosDefecto.add({nombre:elemento});
            });
        };
       
    }
    
    if(!bd.objectStoreNames.contains("tbl_pokemones")){
        const alamcen2=bd.createObjectStore("tbl_pokemones",{keyPath:'id'});
    }
    
    if(!bd.objectStoreNames.contains("tbl_asignaciones")){
        const almacen3=bd.createObjectStore("tbl_asignaciones",{keyPath:'id'});
        almacen3.createIndex('idIDX','idE',{unique:false});
    }
  

};


//Funcionalidad tbl_entrenadores
function agregarNuevoEntrenador(nombreE){
    
    const transaction = db.transaction(["tbl_entrenadores"], "readwrite");
   
    transaction.oncomplete = (event) => {
        mostrar().then(lista=>{
            crearEntrenador(lista);
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
                mostrarAsignacines();
                location.reload();

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
    const transaction = db.transaction("tbl_entrenadores", "readonly");
    const almacen=transaction.objectStore("tbl_entrenadores");

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
        mostrar().then(lista=>{
            crearEntrenador(lista);
            location.reload();
        });
    };

    const almacen=transaction.objectStore(["tbl_entrenadores"]);
    let request=almacen.delete(Number(idE));
    request.onsuccess=(event)=>{
        mostrarAsignacines();
    };

    request.onerror = (event) => {
        console.error("Error al intentar eliminar el registro:", event.target.error);
    };
}

function modificarEntrenador(antiguo,nombreE){
    var transaccion=db.transaction(["tbl_entrenadores"],"readwrite");
    var almacen= transaccion.objectStore("tbl_entrenadores");
    
    transaccion.addEventListener("complete",()=>{
        mostrar().then(lista=>{
            crearEntrenador(lista);
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
                location.reload();
            }
            puntero2.continue();
        }
    });
}


//Funcionalidad tbl_pokemones
function agregarPokemon(pokemon,idP){
    const transaction = db.transaction(["tbl_pokemones"], "readwrite");
   
    transaction.oncomplete = (event) => {
        mostrarPokemones().then(lista=>{
            rellenoDiv(lista);
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
    const transaction = db.transaction("tbl_pokemones", "readonly");
    const almacen=transaction.objectStore("tbl_pokemones");
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

    transaction.oncomplete= (event)=>{
        mostrarPokemones().then(lista=>{
            rellenoDiv(lista);
        });
    };

    const almacen=transaction.objectStore(["tbl_pokemones"]);
    let request=almacen.delete(Number(idP));
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
               
                resolve(true);
            } else {
                
                resolve(false);
            }
        };
    });
}

function obtenerPokemon(idP){
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["tbl_pokemones"], "readonly");
        const almacen = transaction.objectStore("tbl_pokemones");
        let request = almacen.get(Number(idP));

        request.onsuccess = (event) => {
            resolve(request.result)
            
        };
    });
}

//Funcionalidad tbl_asignaciones

function agregarAsignacion(idP,idEntrenador){
    const transaccion=db.transaction("tbl_asignaciones","readwrite");
    const almacen=transaccion.objectStore("tbl_asignaciones");

    const objeto={
        id:Number(idP),
        idE:Number(idEntrenador)
    };
    const request=almacen.add(objeto);

    request.onerror= (evt)=>{
        console.log('Error');
    }
}

function verificarAsignacion(idP){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["tbl_asignaciones"], "readonly");
        const almacen = transaction.objectStore("tbl_asignaciones");
        let request = almacen.get(Number(idP));

        request.onsuccess = (event) => {
            if (request.result) {
               
                resolve(true);
            } else {
                
                resolve(false);
            }
        };
    });
}

function verificarEntrenadorAsignaciones(id){
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["tbl_asignaciones"], "readonly");
        const almacen = transaction.objectStore("tbl_asignaciones");
        const idx=almacen.index('idIDX');
        let request = idx.get(Number(id));

        request.onsuccess = (event) => {
            if (request.result) {
               
                resolve(true);
            } else {
                
                resolve(false);
            }
        };
    });
}

function eliminarAsignaciones(id){
    const transaccion=db.transaction("tbl_asignaciones","readwrite");
    const almacen=transaccion.objectStore("tbl_asignaciones");
    let request=almacen.delete(Number(id));
    location.reload();
   
}

async function mostrarAsignacines(){
    const datos=await mostrar();

    datos.forEach(async (elemento)=>{
        const pokemones=await  traerAsignacionesxEntrenador(elemento.idE);
        pokemones.forEach(elemento2=>{
            mostrarPokemonesAsignados(elemento2.idE,elemento2.id)
        });
    });
    
  
}

function traerAsignacionesxEntrenador(idE){
   
    return new Promise((resolve,reject)=>{
        const transaccion=db.transaction("tbl_asignaciones","readonly");
        const almacen=transaccion.objectStore("tbl_asignaciones");
        const range=IDBKeyRange.only(idE);
        const idx=almacen.index('idIDX');

        const peticion=idx.getAll(range);

        peticion.onsuccess=(evt)=>{
            const resultado=evt.target;
            resolve(resultado.result);
        }
    })
}


export {agregarNuevoEntrenador,eliminarEntrenador,modificarEntrenador,agregarPokemon,obtenerPokemon,eliminarPokemon,verificarExistencia,mostrar,agregarAsignacion,verificarAsignacion,verificarEntrenadorAsignaciones,mostrarAsignacines,eliminarAsignaciones};

