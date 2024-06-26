var bd;
function inciarBD() {
    var solicitud= indexedDB.open("db_Pokedex");

    solicitud.addEventListener("error",mostrarError);
    solicitud.addEventListener("success",comenzar);
    solicitud.addEventListener("upgradeneeded",crearAlmacen);

    let agregar=document.getElementById('agregarEntrenador');
    agregar.addEventListener('click',guardarEntrenador);
    
}

function mostrarError(event) {
    alert("Error");
}

function comenzar(event) {
    bd=event.target.result;
   
}

function crearAlmacen(event) {
    var baseDatos=event.target.result;
    if (!baseDatos.objectStoreNames.contains('tbl_entrenadores')) { 
        baseDatos.createObjectStore('tbl_entrenadores', {keypath:'id',autoIncrement:true}); 

        let datos=event.target.transaction;
        let almacen=datos.objectStore("tbl_entrenadores");
        let entrenadores=['luis','kevin','santos','cristian'];

        for (const nombreE of entrenadores) {   
            almacen.add({
                nombre:nombreE
            });
        }
    }

   

}

function guardarEntrenador() {    
    var transaccion=bd.transaction(["tbl_entrenadores"],"readwrite");
    var almacen2= transaccion.objectStore("tbl_entrenadores");
    let cuenta= almacen2.count();
    cuenta.onsuccess = async function() {
        console.log('Número de registros en miAlmacen:', cuenta.result);
        let registros=cuenta.result;

        if (registros<5) {
            const { value: nombreE } = await Swal.fire({
                title: "Nombre entrenador",
                input: "text",
                inputLabel: "Nombre",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "Ingresa un valor!";
                    }
                }
            });
            almacen2.add({
                nombre:nombreE
            });
        }
        else{
            Swal.fire({
                title: "Maximo permitido!",
                text: "Ya no puedes crear mas entrenadores!",
                icon: "error"
            });
        }
    };
  

   
}

window.addEventListener("load",inciarBD);


