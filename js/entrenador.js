import { crearRow,crearCol,crearCol2 } from "./plantillasEntrenador.js";
import { agregarNuevoEntrenador,eliminarEntrenador,modificarEntrenador,verificarEntrenadorAsignaciones } from "./bd.js";

function crearEntrenador(entrenadores){
    let cuenta=0;
    let entrenador_container=document.getElementById('entrenadores');
    if (entrenador_container!=null) {
        while (entrenador_container.firstChild){
            entrenador_container.removeChild(entrenador_container.firstChild);
        };
        
        let titulo=document.createElement('h3');
        titulo.textContent='Entrenadores';
        entrenador_container.appendChild(titulo);
    
        let rows=Math.ceil(entrenadores.length/2);
        let registros=entrenadores.length;
    
       while (rows!==0) {
            let fila=crearRow();
    
            if (registros===1) {
                let columna=crearCol(entrenadores[cuenta].nombreE,entrenadores[cuenta].idE);
                fila.appendChild(columna);
                cuenta++;
                registros--;
            }
            else{
                let col1=crearCol2(entrenadores[cuenta].nombreE,entrenadores[cuenta].idE);
                cuenta++;
                registros--;
                let col2=crearCol2(entrenadores[cuenta].nombreE,entrenadores[cuenta].idE);
                cuenta++;
                registros--;
                fila.appendChild(col1);
                fila.appendChild(col2);
            }
    
            rows--;
            entrenador_container.appendChild(fila);
       }
    
       let modificar=document.querySelectorAll('.modificar');
    
       modificar.forEach(elemento=>{
            elemento.addEventListener('click',(e)=>{
                Swal.fire({
                    title: "¿Modificar Nombre?",
                    showCancelButton: true,
                    confirmButtonText: "Modificar",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let antiguo=e.target.parentElement.previousElementSibling.innerText;
                        const resultado = await Swal.fire({
                            title: "Modificar Nombre Entrenador",
                            input: "text",
                            inputLabel: "Nuevo Nombre",
                            showCancelButton: true,
                            inputValidator: (value) => {
                              if (!value) {
                                return "Ingresa un valor!";
                              }
                              
                            }
                        }).then(resultado=>{
                            if (resultado.isConfirmed) {
                                const { value: nombreN } = resultado; 
                                modificarEntrenador(antiguo,nombreN);
                            }
                        });
                    }
                });
            });
       });
    
    
       let eliminar=document.querySelectorAll('.eliminar');
       eliminar.forEach(elemento=>{
        elemento.addEventListener('click',async (e)=>{
            let id=e.target.parentElement.id;
            let existe=await verificarEntrenadorAsignaciones(id);
            if (!existe) {
                Swal.fire({
                    title: "¿Eliminar Entrenador?",
                    showCancelButton: true,
                    confirmButtonText: "Eliminar",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        eliminarEntrenador(id);
                    }
                });
            }
            else{
                Swal.fire({
                    text: "No puedes eliminar este entrenador, ya que, tiene pokemones asignados.",
                    icon: "error"
                });
            }
            
        });
       });
    }
 
}

let agregar=document.getElementById('agregarEntrenador');
if (agregar!==null) {
    agregar.addEventListener('click',nuevoEntrenador);
}


async function nuevoEntrenador(){
    const result= await Swal.fire({
        title: "Nombre entrenador",
        input: "text",
        inputLabel: "Nombre",
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "Ingresa un valor!";
            }
        }
    }).then((result)=>{
        if (result.isConfirmed) {
            const {value:nombreE}=result;
            agregarNuevoEntrenador(nombreE);
        }
    });
}


export {crearEntrenador};