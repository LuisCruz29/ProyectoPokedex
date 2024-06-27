import { contenedorPokemones } from "./plantillasEntrenador.js"
import { crearCuadroSeleccionado } from "./plantillas.js";
import { Pokemon } from "./ClsPokemon.js";
import { eliminarPokemon } from "./bd.js";

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
            elemento.addEventListener('click',(e)=>{
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
            });
        });
    }
    
}



export {rellenoDiv};



