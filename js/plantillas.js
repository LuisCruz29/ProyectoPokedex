function crearCuadro(pokemon) {
    const contenedorTipos=document.createElement('div');
    contenedorTipos.classList.add('pk__descripcion');
    pokemon.tipos.forEach(tipo => {
        contenedorTipos.innerHTML+=`
            <span class="badges pk_container_${tipo}">${tipo}</span>
        `;
    });

    const contenedorPrincipal=document.createElement('div');
    contenedorPrincipal.classList.add('contenedor');
    contenedorPrincipal.innerHTML=`
        <div class="pk__container_Principal pk__container_${pokemon.tipos[0]}">
            <div class="pk__complementario">
                <h3>${pokemon.nombre}</h3>
                <img src="${pokemon.imagen.otroShowdownFD}" alt="${pokemon.nombre}" class="pokemon-image">
                <h3 class="pk__descripcion__id">#${pokemon.id}</h3>
            </div>
            ${contenedorTipos.outerHTML}
            <div class="w-100 buttons" id="${pokemon.id}"> 
                <i class="bi bi-list list fs-3" id="icono-card_${pokemon.id}"></i>
                <i class="bi bi-heart-fill heart fs-4" id="icono-agregar_${pokemon.id}"></i>
            </div>
        </div>
    
    `;
    return contenedorPrincipal;
}


function cerrarCard(pokemon) {
    
}


function cardAbout(pokemon) {
    
}


function cardStats(pokemon) {
    
}

function cardDanio(pokemon) {
    
}

export{crearCuadro};