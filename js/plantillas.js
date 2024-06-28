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
    //contenedorPrincipal.setAttribute("data-aos","fade-up");
    //contenedorPrincipal.setAttribute("data-aos","fade-down")
    contenedorPrincipal.setAttribute("data-aos","flip-left")
    //aqui se le puede cambiar la duracion
    contenedorPrincipal.setAttribute("data-aos-duration","2500");
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
                <i class="bi bi-heart-fill heart fs-4" id="agregar"></i>
            </div>
        </div>
    
    `;
    return contenedorPrincipal;
}

function cardAbout(pokemon) {
    let contentbox=document.getElementById('contenedor-info');
    let elementoHIjo=contentbox.firstChild;
    contentbox.removeChild(elementoHIjo);

    const aboutContent = document.createElement('div');
    aboutContent.classList.add('content');

    aboutContent.innerHTML = `
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="">Descripcion</span> ${pokemon.sobrePk.descripcion}</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Altura</span> ${pokemon.sobrePk.altura} m</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Peso</span> ${pokemon.sobrePk.peso} kg</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Habilidades</span> ${pokemon.sobrePk.habilidades.join(', ')}</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Genero</span> ♂ ${pokemon.sobrePk.genero.macho} ♀ ${pokemon.sobrePk.genero.hembra}</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Habitat</span>  ${pokemon.sobrePk.habitat}</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Evolucion</span>  ${pokemon.evoluciones}</p>
        <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Forma</span> ${pokemon.sobrePk.forma} </p>
        <br>
        <br>
    `;

    contentbox.appendChild(aboutContent);
   
}


function cardStats(pokemon) {
    let contentbox=document.getElementById('contenedor-info');
    let elementoHIjo=contentbox.firstChild;
    contentbox.removeChild(elementoHIjo);
    const baseStatsContent = document.createElement('div');
    baseStatsContent.classList.add('content_stats');
    baseStatsContent.innerHTML = `
        <p class="title animate__animated animate__flipInX">HP: ${pokemon.Estadisticas_Base.vida}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.vida < 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped   bg-success progress-bar-animated'}" " role="progressbar" style="width: ${pokemon.Estadisticas_Base.vida}%;" aria-valuenow="${pokemon.Estadisticas_Base.vida}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.vida}%</div>
        </div>
        <p class="title animate__animated animate__flipInX">Attack: ${pokemon.Estadisticas_Base.ataque}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.ataque < 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped   bg-success progress-bar-animated'}" role="progressbar" style="width: ${pokemon.Estadisticas_Base.ataque}%;" aria-valuenow="${pokemon.Estadisticas_Base.ataque}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.ataque}%</div>
        </div>
        <p class="title animate__animated animate__flipInX">Defense: ${pokemon.Estadisticas_Base.defensa}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.defensa < 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped   bg-success progress-bar-animated'}" style="width: ${pokemon.Estadisticas_Base.defensa}%;" aria-valuenow="${pokemon.Estadisticas_Base.defensa}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.defensa}%</div>
        </div>
        <p class="title animate__animated animate__flipInX">Sp. Atk: ${pokemon.Estadisticas_Base.Ataque_Especial}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.Ataque_Especial < 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped  bg-success progress-bar-animated'}" role="progressbar" style="width: ${pokemon.Estadisticas_Base.Ataque_Especial}%;" aria-valuenow="${pokemon.Estadisticas_Base.Ataque_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Ataque_Especial}%</div>
        </div>
        <p class="title animate__animated animate__flipInX">Sp. Def: ${pokemon.Estadisticas_Base.Defensa_Especial}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.Defensa_Especial < 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped   bg-success progress-bar-animated'}" role="progressbar" style="width:  ${pokemon.Estadisticas_Base.Defensa_Especial}%;" aria-valuenow=" ${pokemon.Estadisticas_Base.Defensa_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Defensa_Especial}%</div>
        </div>
        <p class="title animate__animated animate__flipInX">Speed:  ${pokemon.Estadisticas_Base.velocidad}</p>
        <div class="progress animate__animated animate__flipInX">
            <div class="${pokemon.Estadisticas_Base.velocidad< 50 ? 'progress-bar progress-bar-striped  bg-danger progress-bar-animated' : 'progress-bar progress-bar-striped  bg-success progress-bar-animated'}" role="progressbar" style="width: ${pokemon.Estadisticas_Base.velocidad}%;" aria-valuenow="${pokemon.Estadisticas_Base.velocidad}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.velocidad}%</div>
        </div>                
    `;
  
    contentbox.appendChild(baseStatsContent);
}

function cardDanio(pokemon) {
    let contentbox=document.getElementById('contenedor-info');
    let elementoHIjo=contentbox.firstChild;
    contentbox.removeChild(elementoHIjo);
    const danio = document.createElement('div');
    danio.classList.add('content');

    danio.innerHTML = `
       <p class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Recibe doble daño de:</span> ${pokemon.relaciones_danio.double_damage_from}</p>
       <p  class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Realiza doble daño a:</span> ${pokemon.relaciones_danio.double_damage_to} m</p>
       <p  class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Recibe medio daño de:</span> ${pokemon.relaciones_danio.half_damage_from} kg</p>
       <p  class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">Realiza medio daño a:</span> ${pokemon.relaciones_danio.half_damage_to}</p>
       <p  class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">NO recibe daño de:</span> ${pokemon.relaciones_danio.no_damage_from} </p>
       <p  class="animate__animated animate__bounce animate__lightSpeedInLeft"><span class="title">NO realiza daño a:</span> ${pokemon.relaciones_danio.no_damage_to}</p>
       <br>
       <br>
    `;
    
    contentbox.appendChild(danio);
}

function crearCuadroSeleccionado(pokemon) {
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
                <img src="${pokemon.imagen.otroDW}" alt="${pokemon.nombre}" class="pokemon-image">
                <h3 class="pk__descripcion__id">#${pokemon.id}</h3>
            </div>
            ${contenedorTipos.outerHTML}
            <div class="w-100 buttons" id="${pokemon.id}"> 
                <i class="bi bi-x list fs-2" id="eliminarPokemon"></i>
                <i class="bi bi-person-plus fs-4 list" id="asignarPokemon"></i>
            </div>
        </div>
    
    `;
    return contenedorPrincipal;
}

function crearCuadroAsignado(pokemon) {
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
                <img src="${pokemon.imagen.otroDW}" alt="${pokemon.nombre}" class="pokemon-image">
                <h3 class="pk__descripcion__id">#${pokemon.id}</h3>
            </div>
            ${contenedorTipos.outerHTML}
            <div class="w-100 buttons" id="${pokemon.id}"> 
                <i class="bi bi-x list fs-2" id="eliminarAsignacion"></i>
               
            </div>
        </div>
    
    `;
    return contenedorPrincipal;
}
export{crearCuadro,cardAbout,cardStats,cardDanio,crearCuadroSeleccionado,crearCuadroAsignado};