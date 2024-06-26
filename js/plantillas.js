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
                <i class="bi bi-heart-fill heart fs-4" id="icono-agregar_${pokemon.id}"></i>
            </div>
        </div>
    
    `;
    return contenedorPrincipal;
}


function crearCard(pokemon) {
    let tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta', `pk__container_${pokemon.tipos[0]}`);
    // tarjeta.setAttribute('id',`pk-${pokemon.id}`);
    tarjeta.id = `pk-${pokemon.id}`;
    tarjeta.innerHTML=`
        <div class="poke__data__principal">
            <div class="iconos__legendaria__pk">
                <a href="#" id="cerrarCard">
                    <i class="bi bi-arrow-left fs-3 arrow"></i>
                </a>
                <a href="#" id="icono-agregar_${pokemon.id}">
                    <i class="bi bi-heart-fill fs-5 heart"></i>
                </a>
            </div>
            <div class="informacion__legendaria__pk">
                <div class="infor">
                    <h3 class="Nombre">${pokemon.nombre}</h3>
                    <div>
                        ${pokemon.tipos.map(tipo => `<span class="badges">${tipo}</span>`).join('')}
                    </div>
                </div>
                <div class="mostrando__poke__id">
                    <h2 class="id_pokemon">#${pokemon.id}</h2>
                </div>
            </div>
            <div class="poke__img">
                <img class="poke__img_mostrar" src="${pokemon.imagen.otroDW}" alt="${pokemon.nombre}" >
            </div>
        </div>
        <div class="poke__data__segundaria container">
            <div class="tab_box">
                <button id="about" class="tab_btn">Acerca de </button>
                <button id="base_stats" class="tab_btn">Estadisticas</button>
                <button id="relaciones_danio" class="tab_btn">Relaciones Daño</button>
                <div class="line"></div>
            </div>
            <div class="content_box" id="contenedor-info">
                <div></div>
            </div>
        </div>

    `;

    return tarjeta;
}


function cardAbout(pokemon) {
    let contentbox=document.getElementById('contenedor-info');
    let elementoHIjo=contentbox.firstChild;
    contentbox.removeChild(elementoHIjo);

    const aboutContent = document.createElement('div');
    aboutContent.classList.add('content');

    aboutContent.innerHTML = `
        <p class="poke_parrafo"><span class="">Descripcion</span> ${pokemon.sobrePk.descripcion}</p>
        <p class="poke_parrafo"><span class="title">Altura</span> ${pokemon.sobrePk.altura} m</p>
        <p class="poke_parrafo"><span class="title">Peso</span> ${pokemon.sobrePk.peso} kg</p>
        <p class="poke_parrafo"><span class="title">Habilidades</span> ${pokemon.sobrePk.habilidades.join(', ')}</p>
        <p class="poke_parrafo"><span class="title">Genero</span> ♂ ${pokemon.sobrePk.genero.macho} ♀ ${pokemon.sobrePk.genero.hembra}</p>
        <p class="poke_parrafo"><span class="title">Habitat</span>  ${pokemon.sobrePk.habitat}</p>
        <p class="poke_parrafo"><span class="title">Evolucion</span>  ${pokemon.evoluciones}</p>
        <p class="poke_parrafo"><span class="title">Forma</span> ${pokemon.sobrePk.forma} </p>
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
    
        <p class="title">HP: ${pokemon.Estadisticas_Base.vida}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${pokemon.Estadisticas_Base.vida}%;" aria-valuenow="${pokemon.Estadisticas_Base.vida}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.vida}%</div>
        </div>
        <p class="title">Attack: ${pokemon.Estadisticas_Base.ataque}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${pokemon.Estadisticas_Base.ataque}%;" aria-valuenow="${pokemon.Estadisticas_Base.ataque}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.ataque}%</div>
        </div>
        <p class="title">Defense: ${pokemon.Estadisticas_Base.defensa}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${pokemon.Estadisticas_Base.defensa}%;" aria-valuenow="${pokemon.Estadisticas_Base.defensa}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.defensa}%</div>
        </div>
        <p class="title">Sp. Atk: ${pokemon.Estadisticas_Base.Ataque_Especial}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${pokemon.Estadisticas_Base.Ataque_Especial}%;" aria-valuenow="${pokemon.Estadisticas_Base.Ataque_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Ataque_Especial}%</div>
        </div>
        <p class="title">Sp. Def: ${pokemon.Estadisticas_Base.Defensa_Especial}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:  ${pokemon.Estadisticas_Base.Defensa_Especial}%;" aria-valuenow=" ${pokemon.Estadisticas_Base.Defensa_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Defensa_Especial}%</div>
        </div>
        <p class="title">Speed:  ${pokemon.Estadisticas_Base.velocidad}</p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated role="progressbar" style="width: ${pokemon.Estadisticas_Base.velocidad}%;" aria-valuenow="${pokemon.Estadisticas_Base.velocidad}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.velocidad}%</div>
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
       <p class="poke_parrafo"><span class="title">Recibe doble daño de:</span> ${pokemon.relaciones_danio.double_damage_from}</p>
       <p  class="poke_parrafo"><span class="title">Realiza doble daño a:</span> ${pokemon.relaciones_danio.double_damage_to} m</p>
       <p  class="poke_parrafo"><span class="title">Recibe medio daño de:</span> ${pokemon.relaciones_danio.half_damage_from} kg</p>
       <p  class="poke_parrafo"><span class="title">Realiza medio daño a:</span> ${pokemon.relaciones_danio.half_damage_to}</p>
       <p  class="poke_parrafo"><span class="title">NO recibe daño de:</span> ${pokemon.relaciones_danio.no_damage_from} </p>
       <p  class="poke_parrafo"><span class="title">NO realiza daño a:</span> ${pokemon.relaciones_danio.no_damage_to}</p>
       <br>
       <br>
    `;
    
    contentbox.appendChild(danio);
}

export{crearCuadro,crearCard,cardAbout,cardStats,cardDanio};