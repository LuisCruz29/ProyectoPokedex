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
    #dibujarPk(elemento_html, pokemon)
    {
        // creamos un div para la tarjeta de nuestro pokemon
        const tarjetaPk = document.createElement('div');
        tarjetaPk.classList.add('pokemon-card'); // agrega la clase pokemon-card al div 
        
        // crea un elemento img para la imagen del pokemon
        const imgPk = document.createElement('img');
        imgPk.src = pokemon.imagen.otroShowdownFS; 
        imgPk.alt = pokemon.nombre;

        //creamos un h3 para el nombre del pokemon
        const nombrePk = document.createElement('h3');
        nombrePk.textContent = pokemon.nombre; // asigna el nombre del pokemon

        // crea un p para los tipos de pokemon
        const tiposPk = document.createElement('p');
        tiposPk.textContent = `Tipos: ${pokemon.tipos.join(',')}`;

        // creamos un div para sus estadisticas base del pk
        //objeto.entries convierte el objeto en una matriz de parez [clave, valor]
        const estadisticasPk = document.createElement('div');
        estadisticasPk.classList.add('pokemon-stats');

        Object.entries(pokemon.Estadisticas_Base).forEach(([clave, valor])=>
        {
            //crea un elemento p para cada estadistica base del pokemon
            const estadistica = document.createElement('p');
            estadistica.textContent = `${clave}: ${valor}`; // asigna la clave y el valor de la estadistica
            estadisticasPk.appendChild(estadistica);
        });

        // crea un div para informacion sobre el pokemon
        // charat(0) obtiene el primer caracter  de la cadena
        // touppercase convierte mayuscula
        //slice(1) una nueva cadena que comienza del segundo caracter
        const sobrePk = document.createElement('div');
        sobrePk.classList.add('pokemon-about');
        Object.entries(pokemon.sobrePk).forEach(([clave, valor]) => {
            if (typeof valor === 'object') {
                Object.entries(valor).forEach(([subclave, subvalor]) => {
                    const elementoPk = document.createElement('p');
                    elementoPk.textContent = `${subclave.charAt(0).toUpperCase() + subclave.slice(1)}: ${subvalor}`;
                    sobrePk.appendChild(elementoPk);
                });
            } else {
                const elementoPk = document.createElement('p');
                elementoPk.textContent = `${clave.charAt(0).toUpperCase() + clave.slice(1)}: ${valor}`;
                sobrePk.appendChild(elementoPk);
            }
        });

        // crear un div para las evoluciones  del pokemon
        const evolucionesPk = document.createElement('div');
        evolucionesPk.classList.add('pokemon-evolutions');

        const evolucion_titulo = document.createElement('p');
        evolucion_titulo.textContent = "Evoluciones: " // titulo para las evoluciones del pokemon
        evolucionesPk.appendChild(evolucion_titulo);

        pokemon.evoluciones.forEach(e =>
            {
                // crea un p para cada evolucion del pokemon y agregarlo a evolucionesPk
                const elemento_evo = document.createElement('p');
                elemento_evo.textContent = e;
                evolucionesPk.appendChild(elemento_evo);
            }
        );

        // agrega todos los elementos creados al div tarjetapk 
        tarjetaPk.appendChild(imgPk);
        tarjetaPk.appendChild(nombrePk);
        tarjetaPk.appendChild(tiposPk);
        tarjetaPk.appendChild(estadisticasPk);
        tarjetaPk.appendChild(sobrePk);
        tarjetaPk.appendChild(evolucionesPk);

        // agrega la tarjeta pokemon al elemento contendor pokedex
        elemento_html.appendChild(tarjetaPk);
    }
}
