import { contenedorPokemones } from "./plantillasEntrenador.js"
import { crearCuadroSeleccionado,crearCuadroAsignado } from "./plantillas.js";
import { Pokemon } from "./ClsPokemon.js";
import { eliminarPokemon,mostrar,agregarAsignacion,verificarAsignacion,mostrarAsignacines,obtenerPokemon,eliminarAsignaciones } from "./bd.js";


function rellenoDiv(listaPokemones){ 
    let lista=[]
    let divSeleccionados=document.getElementById('pokemonesSeleccionados');
    listaPokemones.forEach(elemento=>{
        
        let objeto=JSON.parse(elemento.estadisticas.value);
        let pokemon= new Pokemon(objeto.id,objeto.nombre,objeto.tipos,objeto.Estadisticas_Base,objeto.evoluciones,objeto.sobrePk,objeto.imagen,objeto.relaciones_danio);
        lista.push(pokemon);
    });
    if (divSeleccionados!==null) {
        while (divSeleccionados.firstChild) {
            divSeleccionados.removeChild(divSeleccionados.firstChild);
        }
        if (listaPokemones.length===0) {
            let h3=document.createElement('h3');
            h3.textContent='Pokemones Seleccionados';
            divSeleccionados.appendChild(h3);
        
            let p=document.createElement('p');
            p.classList.add('text-center');
            p.textContent='No has seleccionado ningun pokemon';
            divSeleccionados.appendChild(p);
        }else{
            let h3=document.createElement('h3');
            h3.textContent='Pokemones Seleccionados';
            divSeleccionados.appendChild(h3);
            let div=contenedorPokemones();
            lista.forEach(elemento=>{
                let cuadro=crearCuadroSeleccionado(elemento);
                div.appendChild(cuadro);
            });
            divSeleccionados.appendChild(div);
        }
        
     
        let eliminarCard=document.querySelectorAll('#eliminarPokemon');
        eliminarCard.forEach(elemento=>{
            elemento.addEventListener('click',async (e)=>{
                let id=e.target.parentElement.id;
                let existe=await verificarAsignacion(id);
                if (!existe) {
                    Swal.fire({
                        title: "¿Desea eliminar este pokemon como acompañante?",
                        showCancelButton: true,
                        confirmButtonText: "Eliminar",
                        cancelButtonText: `Cancelar`
                        }).then((result) => {
                        if (result.isConfirmed) {
                            let id=e.target.parentElement.id;
                            eliminarPokemon(id);
                        }
                    });
                }
                else{
                    Swal.fire({
                        text: "No puedes eliminar este pokemon, ya que esta asignado a un entrenador",
                        icon: "error"
                    });
                }
               
            });
        });

        const opciones = {};
        mostrar().then(lista=>{
            lista.forEach(elemento => {
                opciones[elemento.idE] = elemento.nombreE;
            });
        });
        
        let asignar=document.querySelectorAll('#asignarPokemon');
        asignar.forEach((elemeto)=>{
            elemeto.addEventListener('click',async (e)=>{
                let id=e.target.parentElement.id;
                let existe=await verificarAsignacion(id);
                if (!existe) {
                    const resultado = await Swal.fire({
                        title: "Asignar Pokemon",
                        input: "select",
                        inputOptions:opciones,
                        inputPlaceholder: "Seleccione un entrenador",
                        showCancelButton: true,
                        inputValidator: (value) => {
                            
                        }
                    }).then(async (result)=>{
                        if (result.isConfirmed) {
                            
                            const {value:entrendorID}=result;
                            agregarAsignacion(id,entrendorID);
                            
                            Swal.fire({
                                text: "Pokemon Asignado Correctamente",
                                icon: "success"
                            });
                            mostrarAsignacines();   
                        }
                    });
                }
                else{
                    Swal.fire({
                        text: "Este pokemon ya ha sido asignado",
                        icon: "info"
                    });
                }
               
            });   
        });
    }
    
}

async function mostrarPokemonesAsignados(idEntrenador,idPokemon){
    const divEntrenadores=document.getElementById(`e-${idEntrenador}`);
    while(divEntrenadores.firstChild){
        divEntrenadores.removeChild(divEntrenadores.firstChild);
    }
    let pokemonSF=await obtenerPokemon(idPokemon);
    let objeto=JSON.parse(pokemonSF.value);
    let pokemon= new Pokemon(objeto.id,objeto.nombre,objeto.tipos,objeto.Estadisticas_Base,objeto.evoluciones,objeto.sobrePk,objeto.imagen,objeto.relaciones_danio);
    
    let cuadro=crearCuadroAsignado(pokemon);
    divEntrenadores.appendChild(cuadro);

    eliminar();
}

function eliminar(){
    let eliminarAsignacion=document.querySelectorAll('#eliminarAsignacion');
    eliminarAsignacion.forEach(elemento=>{
        elemento.addEventListener('click',(e)=>{
            Swal.fire({
                title: "¿Desea desasignar este pokemon?",
                showCancelButton: true,
                confirmButtonText: "Desasignar",
                cancelButtonText: `Cancelar`
                }).then((result) => {
                if (result.isConfirmed) {
                    let id=e.target.parentElement.id;
                    eliminarAsignaciones(id);
                }
            });
        });
    });
}

export {rellenoDiv,mostrarPokemonesAsignados};



