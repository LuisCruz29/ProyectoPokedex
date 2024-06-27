import { contenedorPokemones } from "./plantillasEntrenador.js"

let listaPokemones=[]

function rellenoDiv(){
    let divSeleccionados=document.getElementById('pokemonesSeleccionados');
    while (divSeleccionados.firstChild) {
        divSeleccionados.removeChild(divSeleccionados.firstChild);
    }
    let h3=document.createElement('h3');
    h3.textContent='Pokemones Seleccionados';
    divSeleccionados.appendChild(h3);

    if (listaPokemones.length===0) {
        let p=document.createElement('p');
        p.classList.add('text-center');
        p.textContent='No has seleccionado ningun pokemon';
        divSeleccionados.appendChild(p);
    }
    else{
        let div=contenedorPokemones();
        divSeleccionados.appendChild(div);
    }
}

rellenoDiv();