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
        const imagen = dato.sprites.front_default;

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
        imgPk.src = pokemon.imagen;
        imgPk.alt = pokemon.nombre;
        imgPk.classList.add('pokemon-image');
        pkComplementario.appendChild(imgPk);
    
        // Creamos el ID del Pokémon
        const idPk = document.createElement('h4');
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
    }
}
