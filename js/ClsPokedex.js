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
                const peticion = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);

                //verificamos si la respuesta es existosa
                if (peticion.ok) 
                {
                    //convertimos nuestra respuesta de la peticion en un objeto JSON
                    const dato = await peticion.json();

                    // //realizamos una peticion para obtener datos adicionales del pokemon (especies)
                    // const peticion_Especie = await fetch(dato.species.url);
                    // const dato_Especie = await peticion_Especie.json();
                    
                    // //realizamos una peticion para obtener la cadena de evolucion de un pokemon
                    // const peticion_Evolucion = await fetch(dato.evolution_chain.url);
                    // const dato_Evolucion = await peticion_Evolucion.json();

                    //Verificamos si `species` existe antes de intentar acceder a `species.url`
                    
                    const peticion_Especie = await fetch(dato.species.url);
                    let dato_Especie=null;
                    let dato_Evolucion = null;
                    if (peticion_Especie.ok) {
                        dato_Especie = await peticion_Especie.json();

                        // Verificamos si `evolution_chain` existe antes de intentar acceder a `evolution_chain.url`
                        let evolutionChainUrl = dato_Especie.evolution_chain ? dato_Especie.evolution_chain.url : null;
                       
                        if (evolutionChainUrl) {
                            
                            const peticion_Evolucion = await fetch(evolutionChainUrl);
                            if (peticion_Evolucion.ok) {
                                dato_Evolucion = await peticion_Evolucion.json();
                            }
                        }
                    }
                

                    // llamamos al metodo crear un objeto pokemon y agreamos los datos a la lista
                    this.#crearPk(dato, dato_Especie, dato_Evolucion);
                }
            }
            catch (error) {
                console.error(`Error en el fetch para el Pokemon ID ${i}:`, error);
            }

        }
    }

    // creamos un metodo privado para crear un objeto pokemon y poderlo agregarlo a la lista
    #crearPk(dato, especie, evolucion)
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

        //calcula el porcentaje de machos 
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

        // creamos un objeto de pokemon con la informacion obtenida
        const pk = new Pokemon(id, nombre, tipos, Estadisticas_Base, evoluciones, sobrePk, imagen);

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

    //creamos un metodo publico asincronico
    async dibujarPokedex()
    {
       
        // esperamos que se complete la obtencion de datos de pokemon
        await this.#getDatosPk();
        console.log(this.listaPokemon[1]);
        //obtenemos el id del elemento html donde crearemos la pokedex 
        const Elemento_pokedex = document.getElementById('pokedex');
        // vamos a iterar sobre la lista de pokemon y dibujar cada elemento en la pokedex
        this.listaPokemon.forEach(x => this.#dibujarPk(Elemento_pokedex, x));
       
    }

    //creamos un metodo privado para dibujar el pokemon
    #dibujarPk(elemento_html, pokemon) {
        elemento_html = document.querySelector('body');
        // Creamos un ID único para la tarjeta basado en el ID del Pokémon
        const idUnico = `pk-${pokemon.id}`;
    
        // Creamos el contenedor principal
        const contenedorPrincipal = document.createElement('div');
        contenedorPrincipal.classList.add('contenedor');
        contenedorPrincipal.id = idUnico; // Asignamos el ID único al contenedor principal
    
        // Creamos el contenedor pk__container_Principal dentro del contenedor principal
        const pkContainerPrincipal = document.createElement('div');
        pkContainerPrincipal.classList.add('pk__container_Principal', `pk__container_${pokemon.tipos[0]}`, 'principalContainer');
    
        // Creamos el contenedor pk__complementario
        const pkComplementario = document.createElement('div');
        pkComplementario.classList.add('pk__complementario');
    
        // Creamos el título h3 dentro de pk__complementario (Nombre del Pokémon)
        const tituloPk = document.createElement('h3');
        tituloPk.textContent = pokemon.nombre; // Asignamos el nombre del Pokémon al título
        pkComplementario.appendChild(tituloPk);
    
        // Creamos la imagen del Pokémon dentro de pk__complementario
        const imgPk = document.createElement('img');
        imgPk.src = pokemon.imagen.otroShowdownFS;
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
    
        // Agregamos pkComplementario y pkDescripcion a pkContainerPrincipal
        pkContainerPrincipal.appendChild(pkComplementario);
        pkContainerPrincipal.appendChild(pkDescripcion);
    
        // Agregamos pkContainerPrincipal al contenedor principal (contenedorPrincipal)
        contenedorPrincipal.appendChild(pkContainerPrincipal);
    
        // Finalmente, agregamos contenedorPrincipal al elemento HTML proporcionado (elemento_html)
        elemento_html.appendChild(contenedorPrincipal);  

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
            <a href="/html/pokemones.html"><img src="/img/flecha-derecha.png" height="20px" width="30px"></a>
            <a href="#"><img src="/img/corazn.png" height="20px" width="30px"></a>
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
        img.src = pokemon.imagen;
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
            <button type="button" class="tab_btn">About</button>
            <button type="button" class="tab_btn">Base Stats</button>
            <button type="button" class="tab_btn">Moves</button>
            <div class="line"></div>
        `; 

        pokeDataSecundaria.appendChild(tabBox);
        
        //donde ira el contenido del nav bar
        const contentbox = document.createElement('div');
        contentbox.classList.add('content_box');

        //primer pestaña about 
        const aboutContent = document.createElement('div');
        aboutContent.classList.add('content', 'active');

        aboutContent.innerHTML = `
            <p class="Species"><span class="title">Species</span> ${pokemon.sobrePk.generacion}</p>
            <p class="Height"><span class="title">Height</span> ${pokemon.sobrePk.altura} m</p>
            <p class="Weight"><span class="title">Weight</span> ${pokemon.sobrePk.peso} kg</p>
            <p class="Abilities"><span class="title">Abilities</span> ${pokemon.sobrePk.habilidades.join(', ')}</p>
            <h2>Breeding</h2>
            <p class="Gender"><span class="title">Gender</span> ♂ ${pokemon.sobrePk.genero.macho} ♀ ${pokemon.sobrePk.genero.hembra}</p>
            <p class="Egg Groups"><span class="title">Egg Groups</span> ${pokemon.sobrePk.habitat}</p>
            <p class="Egg Cycle"><span class="title">Egg Cycle</span> ${pokemon.sobrePk.forma}</p>
            <br>
            <br>
        `;
        /*por cada contenedor que crees debe ir esto*/
        contentbox.appendChild(aboutContent);
        pokeDataSecundaria.appendChild(contentbox);
        tarjeta.appendChild(pokeDataSecundaria);
        elemento_html.appendChild(tarjeta);
        
        /*inicia base stap*/
        const baseStatsContent = document.createElement('div');
        baseStatsContent.classList.add('content_stats');
        baseStatsContent.innerHTML = `
                                    <div class="stats">
                                        <p>HP: ${pokemon.Estadisticas_Base.vida}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.vida}%;" aria-valuenow="${pokemon.Estadisticas_Base.vida}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.vida}%</div>
                                        </div>
                                        <p>Attack: ${pokemon.Estadisticas_Base.ataque}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.ataque}%;" aria-valuenow="${pokemon.Estadisticas_Base.ataque}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.ataque}%</div>
                                        </div>
                                        <p>Defense: ${pokemon.Estadisticas_Base.defensa}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.defensa}%;" aria-valuenow="${pokemon.Estadisticas_Base.defensa}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.defensa}%</div>
                                        </div>
                                        <p>Sp. Atk: ${pokemon.Estadisticas_Base.Ataque_Especial}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.Ataque_Especial}%;" aria-valuenow="${pokemon.Estadisticas_Base.Ataque_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Ataque_Especial}%</div>
                                        </div>
                                    </div>
                                `;
                                /* esto ultimo que esta comentariado va despues de sp. Atk  lo quite por que sobrepasa los limite 
                                esto se debe arreglar caballo*/
                                /* esto que comentareo va de ultimo
                                    <p>Sp. Def: ${pokemon.Estadisticas_Base.Defensa_Especial}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width:  ${pokemon.Estadisticas_Base.Defensa_Especial}%;" aria-valuenow=" ${pokemon.Estadisticas_Base.Defensa_Especial}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.Defensa_Especial}%</div>
                                        <p>Speed:  ${pokemon.Estadisticas_Base.velocidad}</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${pokemon.Estadisticas_Base.velocidad}%;" aria-valuenow="${pokemon.Estadisticas_Base.velocidad}" aria-valuemin="0" aria-valuemax="100">${pokemon.Estadisticas_Base.velocidad}%</div>
                                        </div>
                                        <p>Total: sin calcular</p>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: 52.83%;" aria-valuenow="317" aria-valuemin="0" aria-valuemax="600">52.83%</div>
                                        </div>?*/
        
        contentbox.appendChild(baseStatsContent);

        // Asegúrate de que contentbox esté añadido a pokeDataSecundaria y luego a tarjeta tene en cuenta esto por que muchas veces ahi me dio error
        pokeDataSecundaria.appendChild(contentbox);
        tarjeta.appendChild(pokeDataSecundaria);

        // Asegúrate de que contenedorPrincipal esté añadido a elemento_html igual aqui debes de tomar en cuenta esto
        elemento_html.appendChild(contenedorPrincipal);

        //aqui iria el codigo para que crees la honda de los ataques 

        //bueno ya cuando creee el ultimo contenedor donde iran los atakes que tiene el pokemos esto siempre Asegúrate que debe ir de ultimo para que funcione 
        this.poke_evetento_click(contenedorPrincipal, tarjeta);
        this.poke_nav_movimiento(tarjeta);

        /*bueno ya de ultimo diria podemos poner las para te de codigos en diferentes metodos*/
    }

    /*este metodo lo que ase es que funcione el evento click*/
    poke_evetento_click(contenedorPrincipal,tarjeta){
        contenedorPrincipal.addEventListener('click', function () {
            tarjeta.style.display = 'block'; // Mostrar la tarjeta correspondiente al hacer clic
        });
    }

    /*este otro lo que hhace que funcione lo que es el nav bar de la targeta*/
    poke_nav_movimiento(tarjeta){
        const tabs = tarjeta.querySelectorAll(".tab_btn");
        const all_content = tarjeta.querySelectorAll(".content");
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                tab.classList.add('active');
                var line = tarjeta.querySelector('.line');
                line.style.width = e.target.offsetWidth + "px";
                line.style.left = e.target.offsetLeft + "px";
    
                all_content.forEach(content => {
                    content.classList.remove('active');
                });
                all_content[index].classList.add('active');
            });
        });
    }
}

/*tambien faltaria en el diseño ponerle lo que seria el coraxon blanco y la flecha tambien
,tambien toma en cuenta que fata calcular el total content_stats ahi le das un diseño xd*/