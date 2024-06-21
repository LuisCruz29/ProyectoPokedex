// Importa la clase Pokemon del archivo ClsPokemon.js.
import { Pokemon } from "./ClsPokemon.js";

export class Pokedex
{
    //constructor de la clase pokedex
    constructor() 
    {
        //inicializamos un array vacio para almacenar la lista de pokemon
        this.listaPokemon = [];
    }

    //Creamos un metodo privado para obtener los datos de los pokemones
    async #getDatosPk()
    {
        //recorremos del valor 1 al 150 para obtener los primeros 150 pokemones
        for (let i = 1; i <=150; i++) 
        {
            try 
            {
                //realizamos una peticion a nuestra api para obtener los datos correspondientes al pk con el id actual
                let peticionDatos = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`).then(data=>data.json());
                let dato_Especie = await fetch(peticionDatos.species.url).then(data=>data.json()); 
                let dato_Evolucion = await fetch(dato_Especie.evolution_chain.url ).then(data=>data.json());
                let danios= await fetch(peticionDatos.types[0].type.url).then(datos=>datos.json());
                this.#crearPk(peticionDatos, dato_Especie, dato_Evolucion,danios);
                
            }
            catch (error) {
                console.error(`Error en el fetch para el Pokemon ID ${i}:`, error);
            }

        }
    }

    // creamos un metodo privado para crear un objeto pokemon y poderlo agregarlo a la lista
    #crearPk(dato, especie, evolucion,danios)
    {
     
        //obtenemos el id del pokemon
        const id = dato.id;

        //obtenemos el nombre del pokemon
        const nombre = dato.name;

        // obtenemos los tipos del pokemon como un array de nombres de tipos
        const tipos = dato.types.map( x => x.type.name);

        //obtnemos las estadisticas base del pokemin y las organizamos como un objeto
        const Estadisticas_Base = 
        {
            vida: dato.stats.find(estadistica => estadistica.stat.name === "hp").base_stat,
            ataque: dato.stats.find(estadistica => estadistica.stat.name === "attack").base_stat,
            defensa: dato.stats.find(estadistica => estadistica.stat.name === "defense").base_stat,
            Ataque_Especial: dato.stats.find(estadistica => estadistica.stat.name === "special-attack").base_stat,
            Defensa_Especial: dato.stats.find(estadistica => estadistica.stat.name === "special-defense").base_stat,
            velocidad: dato.stats.find(estadistica => estadistica.stat.name === "speed").base_stat
        };
        //calcula el porcentaje de machos 
        const macho = especie.gender_rate === 0 ? 0:
                      especie.gender_rate === 8 ? 100:
                      especie.gender_rate * 12.5;

        //calcula el porcentaje de hembra 
        const hembra = especie.gender_rate === 0 ? 0:
                      especie.gender_rate === 8 ? 100:
                      (8 - especie.gender_rate) * 12.5;

        //obtenemos informacion adicional sobre el pokemon y la organiza en un objeto
        const sobrePk = 
        {
            //obtiene una descripcion del pk en español 
            descripcion: especie.flavor_text_entries.find( l => l.language.name === "es").flavor_text,

            //obtiene el habitat del pokemon (si esta disponible , de lo contrario se establece como desconocido)
            habitat: especie.habitat ? especie.habitat.name : "Desconocido",

            //obtenemos la generacion
            generacion: especie.generation.name,

            //obtenemos el color 
            color: especie.color.name,

            //obtenemos la forma
            forma: especie.shape.name,

            //obtenemos la altura del pokemon como esta en decimetros es necesario aplicar la conversion a metros
            altura: dato.height / 10,

            //obtenemos el peso en hectogramas y convertimos a kg
            peso: dato.weight / 10,

            // obtiene las habilidades de un pokemon 
            habilidades: dato.abilities ? dato.abilities.map(h => h.ability.name) : [],
           
            // obtiene el genero del pokemon  y su porcentaje (si esta disponible)
            genero:
            {
                macho: macho.toFixed(2) + "%", 
                hembra: hembra.toFixed(2) + "%"
            }
        }

        
       
        // obtiene la cadena de evoluciones del pokemon utilizando el metodo obtener evoluciones 
        const evoluciones = this.#getEvoluciones(evolucion.chain);

        // obtenemos la url de la imagen del pokemon
        const imagen =
        {
            backDefault: dato.sprites.back_default,
            backShiny: dato.sprites.back_shiny,
            frontDefault: dato.sprites.front_default,
            frontShiny: dato.sprites.front_shiny,
            otroDW: dato.sprites.other.dream_world.front_default,
            otroHomeFD: dato.sprites.other.home.front_default,
            otroHomeFS: dato.sprites.other.home.front_shiny,
            otroOficialArtworkFD: dato.sprites.other['official-artwork'].front_default,
            otroOficialArtworkFS: dato.sprites.other['official-artwork'].front_shiny,
            otroShowdownBD: dato.sprites.other.showdown.back_default,
            otroShowdownBS: dato.sprites.other.showdown.back_shiny,
            otroShowdownFD: dato.sprites.other.showdown.front_default,
            otroShowdownFS: dato.sprites.other.showdown.front_shiny
        };

       
        const relaciones_danio={
            double_damage_from:danios.damage_relations.double_damage_from.length!==0 ? danios.damage_relations.double_damage_from.map(d=>d.name):['Ninguno'],
            double_damage_to:danios.damage_relations.double_damage_to.length!==0 ? danios.damage_relations.double_damage_to.map(d=>d.name):['Ninguno'],
            half_damage_from:danios.damage_relations.half_damage_from.length!==0 ? danios.damage_relations.half_damage_from.map(d=>d.name):['Ninguno'],
            half_damage_to:danios.damage_relations.half_damage_to.length!==0 ? danios.damage_relations.half_damage_to.map(d=>d.name):['Ninguno'],
            no_damage_from:danios.damage_relations.no_damage_from.length!==0 ? danios.damage_relations.no_damage_from.map(d=>d.name):['Ninguno'],
            no_damage_to:danios.damage_relations.no_damage_to.length!==0 ? danios.damage_relations.no_damage_to.map(d=>d.name):['Ninguno'],
        }

       
        // creamos un objeto de pokemon con la informacion obtenida
        const pk = new Pokemon(id, nombre, tipos, Estadisticas_Base, evoluciones, sobrePk, imagen,relaciones_danio);

        // agrega el objeto nuevo pokemon a la lista pokemon
        this.listaPokemon.push(pk);
    }

    // creamos un metodo privado  para obtener la cadena de evoluciones del pokemon
    #getEvoluciones(cadena_evolucion)
    {
        // inicializamos un array vacio para almacenar los nombre de los especies de la cadena de la evolucion
        let evoluciones = [];

        // inicializa cadena actual con el objeto de evolucion  recibida como argumento
        let cadena_actual = cadena_evolucion;

        //  vamos iterar mientras exista una cadena de evolucion actual
        while (cadena_actual) 
        {
            // agrega el nombre de la especie actual al array de evoluciones
            evoluciones.push(cadena_actual.species.name);

            //avanza a la siguiente evolucion en la cadena (si existe)
            cadena_actual = cadena_actual.evolves_to[0];//accediendo primer elemento de evolves_to y se utiliza para avanzar la siguiente evolucion en la cadena de evolucion hasta que no haya evoluciones (null)
        }

        // retorna el array de evoluciones que contiene los nombres de las especies en la cadena de evolucion
        return evoluciones;
    }

  
    async dibujarPokedex()
    {
       
        await this.#getDatosPk();
        console.log(this.listaPokemon[1]);
        //obtenemos el id del elemento html donde crearemos la pokedex 
        const Elemento_pokedex = document.getElementById('pokedex');
        
        this.listaPokemon.forEach(x => this.#dibujarPk(Elemento_pokedex, x));
       
    }

    //creamos un metodo privado para dibujar el pokemon
    #dibujarPk(elemento_html, pokemon) {
       
        const idUnico = `${pokemon.id}`;
    
        // Creamos el contenedor principal
        const contenedorPrincipal = document.createElement('div');
        contenedorPrincipal.classList.add('contenedor');
    
        // Creamos el contenedor pk__container_Principal dentro del contenedor principal
        const pkContainerPrincipal = document.createElement('div');
        pkContainerPrincipal.classList.add('pk__container_Principal', `pk__container_${pokemon.tipos[0]}`);
    
        // Creamos el contenedor pk__complementario
        const pkComplementario = document.createElement('div');
        pkComplementario.classList.add('pk__complementario');
    
        // Creamos el título h3 dentro de pk__complementario (Nombre del Pokémon)
        const tituloPk = document.createElement('h3');
        tituloPk.textContent = pokemon.nombre; // Asignamos el nombre del Pokémon al título
        pkComplementario.appendChild(tituloPk);
    
        // Creamos la imagen del Pokémon dentro de pk__complementario
        const imgPk = document.createElement('img');
        imgPk.src = pokemon.imagen.otroShowdownFD;
        imgPk.alt = pokemon.nombre;
        imgPk.classList.add('pokemon-image');
        pkComplementario.appendChild(imgPk);
    
        // Creamos el ID del Pokémon dentro de pk__descripcion
        const idPk = document.createElement('h3');
        idPk.classList.add('pk__descripcion__id');
        idPk.textContent = `#${pokemon.id}`;
        pkComplementario.appendChild(idPk);

        // Creamos el contenedor pk__descripcion
        const pkDescripcion = document.createElement('div');
        pkDescripcion.classList.add('pk__descripcion');
    
        // Creamos los tipos del Pokémon dentro de pk__descripcion
        pokemon.tipos.forEach(tipo => {
            const spanTipo = document.createElement('span');
            spanTipo.textContent = tipo;
            spanTipo.classList.add('badges');
            spanTipo.classList.add(`pk__container_${tipo}`);
            pkDescripcion.appendChild(spanTipo);
        });

        const pkVerStats=document.createElement('div');
        const btnStast=document.createElement('button');
        btnStast.innerText='Ver Stats';
        btnStast.classList.add('btn','btn-outline-secondary','mt-2','text-white');
        btnStast.setAttribute('id',idUnico);
        pkVerStats.appendChild(btnStast);
    
        // Agregamos pkComplementario y pkDescripcion a pkContainerPrincipal
        pkContainerPrincipal.appendChild(pkComplementario);
        pkContainerPrincipal.appendChild(pkDescripcion);
        pkContainerPrincipal.appendChild(pkVerStats);
    
        // Agregamos pkContainerPrincipal al contenedor principal (contenedorPrincipal)
        contenedorPrincipal.appendChild(pkContainerPrincipal);
    
        // Finalmente, agregamos contenedorPrincipal al elemento HTML proporcionado (elemento_html)
        elemento_html.appendChild(contenedorPrincipal);  

        btnStast.addEventListener('click', (e)=>{
            let id=e.target.getAttribute('id');
            this.#crearCardPokemon(id);
        })
    }

    /*este metodo lo que ase es que funcione el evento click*/
   

    /*este otro lo que hhace que funcione lo que es el nav bar de la targeta*/
    poke_nav_movimiento(tarjeta){
        const tabs = tarjeta.querySelectorAll(".tab_btn");
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                tab.classList.add('active');
                var line = tarjeta.querySelector('.line');
                line.style.width = e.target.offsetWidth + "px";
                line.style.left = e.target.offsetLeft + "px";
            });
        });
    }

    #crearCardPokemon(idPokemon){
        const elemento_html=document.getElementById('pokedex');
        const pokemon=this.listaPokemon[idPokemon-1];

        //dibujando la targetas
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta', `pk__container_${pokemon.tipos[0]}`);
        tarjeta.id = `pk-${pokemon.id}`;

        //aqui va la parte pricipal de los datos 
        const pokeDataPrincipal = document.createElement('div');
        pokeDataPrincipal.classList.add('poke__data__principal');

        //iconos para las navegacion y accion que realizara
        const iconos = document.createElement('div');
        iconos.classList.add('iconos__legendaria__pk');
        iconos.innerHTML = `
            <a href="#" id='cerrarCard'><i class="bi bi-arrow-left fs-3 arrow" "></i></a>
            <a href="#" id="addPokemon"><i class="bi bi-heart-fill fs-5 heart"></i></a>
        `;

        pokeDataPrincipal.appendChild(iconos);
        
        //ahora para la informacion basica de los pokemones 
        const  info = document.createElement('div');
        info.classList.add('informacion__legendaria__pk');

        info.innerHTML = `
            <div class="infor">
                <h3 class="Nombre">${pokemon.nombre}</h3>
                <div>
                    ${pokemon.tipos.map(tipo => `<span class="badges">${tipo}</span>`).join('')}
                </div>
            </div>
            <div class="mostrando__poke__id">
                <h2 class="id_pokemon">#${pokemon.id}</h2>
            </div>
        `;

        pokeDataPrincipal.appendChild(info);

        //ahora para que nuestro contendor contenga la imagen
        const pokeImg = document.createElement('div');
        pokeImg.classList.add('poke__img');
        const img = document.createElement('img');
        img.classList.add('poke__img_mostrar');
        img.src = pokemon.imagen.otroDW;
        img.alt = pokemon.nombre;
        img.height = 130;
        pokeImg.appendChild(img);
        pokeDataPrincipal.appendChild(pokeImg);
        //agregandolo a la targeta
        tarjeta.appendChild(pokeDataPrincipal);


        // Parte secundaria de datos del Pokémon
        const pokeDataSecundaria = document.createElement('div');
        pokeDataSecundaria.classList.add('poke__data__segundaria', 'container');
        //ahora crearemos la parte segundaria de nuestro tarjeta
        const tabBox = document.createElement('div');
        tabBox.classList.add('tab_box');
        //esto son las secciones que lleva el nav
        tabBox.innerHTML = `
            <button id="about" class="tab_btn">About</button>
            <button id="base_stats" class="tab_btn">Base Stats</button>
            <button id="relaciones_danio" class="tab_btn">Relaciones Daño</button>
            <div class="line"></div>
        `; 

        pokeDataSecundaria.appendChild(tabBox);
        
        //donde ira el contenido del nav bar
        const contentbox = document.createElement('div');
        contentbox.classList.add('content_box');
        contentbox.setAttribute('id','contenedor-info');

        const divAtajo=document.createElement('div');
        contentbox.appendChild(divAtajo);

        pokeDataSecundaria.appendChild(contentbox);
        tarjeta.appendChild(pokeDataSecundaria);
        elemento_html.appendChild(tarjeta);

        let about=document.getElementById('about');
        let base_stats=document.getElementById('base_stats');
        let relaciones_danio=document.getElementById('relaciones_danio');
       
        about.addEventListener('click', (e)=>{
            this.#cardAbout(pokemon);
        });

        base_stats.addEventListener('click', (e)=>{
            this.#cardBaseStats(pokemon);
        });

        relaciones_danio.addEventListener('click', (e)=>{
            this.#cardRelacionesDanio(pokemon);
        });
           
        this.poke_nav_movimiento(tarjeta);
        this.#cardAbout(pokemon);

        let cerrarTarjeta=document.getElementById('cerrarCard');
        cerrarTarjeta.addEventListener('click',(e)=>{
            let tarjetaCerrar=elemento_html.lastChild;
            elemento_html.removeChild(tarjetaCerrar);
        });
    }

    #cardAbout(pokemon){

        let contentbox=document.getElementById('contenedor-info');
        let elementoHIjo=contentbox.firstChild;
        contentbox.removeChild(elementoHIjo);
         //primer pestaña about 
         const aboutContent = document.createElement('div');
         aboutContent.classList.add('content');
 
         aboutContent.innerHTML = `
             <p><span class="title">Descripcion</span> ${pokemon.sobrePk.descripcion}</p>
             <p><span class="title">Altura</span> ${pokemon.sobrePk.altura} m</p>
             <p><span class="title">Peso</span> ${pokemon.sobrePk.peso} kg</p>
             <p><span class="title">Habilidades</span> ${pokemon.sobrePk.habilidades.join(', ')}</p>
             <p><span class="title">Genero</span> ♂ ${pokemon.sobrePk.genero.macho} ♀ ${pokemon.sobrePk.genero.hembra}</p>
             <p><span class="title">Habitat</span>  ${pokemon.sobrePk.habitat}</p>
             <p><span class="title">Evolucion</span>  ${pokemon.evoluciones}</p>
             <p><span class="title">Forma</span> ${pokemon.sobrePk.forma} </p>
             <br>
             <br>
         `;
         /*por cada contenedor que crees debe ir esto*/
         contentbox.appendChild(aboutContent);
    }

    #cardBaseStats(pokemon){
        let contentbox=document.getElementById('contenedor-info');
        let elementoHIjo=contentbox.firstChild;
        contentbox.removeChild(elementoHIjo);
        /*inicia base stap*/
        const baseStatsContent = document.createElement('div');
        baseStatsContent.classList.add('content_stats');
        baseStatsContent.innerHTML = `
        
            <p class="title">HP: ${pokemon.Estadisticas_Base.vida}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.vida}%;" aria-valuenow="${pokemon.Estadisticas_Base.vida}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.vida}%</div>
            </div>
            <p class="title">Attack: ${pokemon.Estadisticas_Base.ataque}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.ataque}%;" aria-valuenow="${pokemon.Estadisticas_Base.ataque}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.ataque}%</div>
            </div>
            <p class="title">Defense: ${pokemon.Estadisticas_Base.defensa}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.defensa}%;" aria-valuenow="${pokemon.Estadisticas_Base.defensa}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.defensa}%</div>
            </div>
            <p class="title">Sp. Atk: ${pokemon.Estadisticas_Base.Ataque_Especial}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.Ataque_Especial}%;" aria-valuenow="${pokemon.Estadisticas_Base.Ataque_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Ataque_Especial}%</div>
            </div>
            <p class="title">Sp. Def: ${pokemon.Estadisticas_Base.Defensa_Especial}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width:  ${pokemon.Estadisticas_Base.Defensa_Especial}%;" aria-valuenow=" ${pokemon.Estadisticas_Base.Defensa_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Defensa_Especial}%</div>
            </div>
            <p class="title">Speed:  ${pokemon.Estadisticas_Base.velocidad}</p>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.velocidad}%;" aria-valuenow="${pokemon.Estadisticas_Base.velocidad}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.velocidad}%</div>
            </div>
                                  
        `;
                               
                                
                                        
        
        contentbox.appendChild(baseStatsContent);
    }

    #cardRelacionesDanio(pokemon){
        let contentbox=document.getElementById('contenedor-info');
        let elementoHIjo=contentbox.firstChild;
        contentbox.removeChild(elementoHIjo);
         //primer pestaña about 
         const aboutContent = document.createElement('div');
         aboutContent.classList.add('content');
 
         aboutContent.innerHTML = `
            <p><span class="title">Recibe doble daño de:</span> ${pokemon.relaciones_danio.double_damage_from}</p>
            <p><span class="title">Realiza doble daño a:</span> ${pokemon.relaciones_danio.double_damage_to} m</p>
            <p><span class="title">Recibe medio daño de:</span> ${pokemon.relaciones_danio.half_damage_from} kg</p>
            <p><span class="title">Realiza medio daño a:</span> ${pokemon.relaciones_danio.half_damage_to}</p>
            <p><span class="title">NO recibe daño de:</span> ${pokemon.relaciones_danio.no_damage_from} </p>
            <p><span class="title">NO realiza daño a:</span> ${pokemon.relaciones_danio.no_damage_to}</p>
            <br>
            <br>
         `;
         /*por cada contenedor que crees debe ir esto*/
         contentbox.appendChild(aboutContent);
    }

   
}

/*tambien faltaria en el diseño ponerle lo que seria el coraxon blanco y la flecha tambien
,tambien toma en cuenta que fata calcular el total content_stats ahi le das un diseño xd*/