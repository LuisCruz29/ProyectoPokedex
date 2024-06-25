// Importa la clase Pokemon del archivo ClsPokemon.js.
import { Pokemon } from "./ClsPokemon.js";
import {Toast} from "./alertas.js";
import { crearCuadro,crearCard,cardAbout,cardStats,cardDanio } from "./plantillas.js";
export class Pokedex
{
    //constructor de la clase pokedex
    constructor() 
    {
        //inicializamos un array vacio para almacenar la lista de pokemon
        this.listaPokemon = [];

        //Creamos una lista para almacenar los pokemones filtrados
        this.listaPokemonsFiltro= [];

        
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

        // agrega el objeto nuevo pokemon a la listas
        this.listaPokemon.push(pk);
        this.listaPokemonsFiltro.push(pk);
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
       
        //obtenemos el id del elemento html donde crearemos la pokedex 
        const Elemento_pokedex = document.getElementById('pokedex');

        // anadimos los eventos listeners para los  botones
        document.getElementById('filtrar-id').addEventListener('click', () => this.#filtroPorId());
        document.getElementById('filtrar-tipo').addEventListener('click', () => this.#filtroPorTipo());
        document.getElementById('filtrar-nombre').addEventListener('click',()=>this.#filtroNombre());
        document.getElementById('limpiar-filtro').addEventListener('click', () => this.#limpiarFiltro());

        //dibujar cada pokemon
        this.listaPokemon.forEach(x => this.#dibujarPk(Elemento_pokedex, x));
    }

    //creamos un metodo privado para dibujar el pokemon
    #dibujarPk(elemento_html, pokemon) {
        let cuadro=crearCuadro(pokemon);
        // agregamos contenedorPrincipal al elemento HTML proporcionado (elemento_html)
        elemento_html.appendChild(cuadro);  
        
        let id=`icono-card_${pokemon.id}`;
        let mostrarCard=document.getElementById(id);
        mostrarCard.addEventListener('click', (e)=>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            this.#crearCardPokemon(id);
        });
        
        //audio pokemon
        var audio = document.getElementById("poke_audi");
        audio.play().catch(error => {
            alert("Error: ",error);
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

        // // //dibujando la targetas
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
        //const tarjeta2=crearCard(pokemon);
        elemento_html.appendChild(tarjeta);

        let about=document.getElementById('about');
        let base_stats=document.getElementById('base_stats');
        let relaciones_danio=document.getElementById('relaciones_danio');
       
        about.addEventListener('click', (e)=>{
            cardAbout(pokemon);

        });

        base_stats.addEventListener('click', (e)=>{
            cardStats(pokemon);
        });

        relaciones_danio.addEventListener('click', (e)=>{
            cardDanio(pokemon);
        });
        
       
        this.poke_nav_movimiento(tarjeta);
        cardAbout(pokemon);

        let cerrarTarjeta=document.getElementById('cerrarCard');
        cerrarTarjeta.addEventListener('click',(e)=>{
            let tarjetaCerrar=elemento_html.lastChild;
            elemento_html.removeChild(tarjetaCerrar);
        });


    }


    #filtroNombre(){
        const filtro=document.getElementById('filtro-input').value;
        if (!filtro) {
            Toast.fire({
                icon: "error",
                title: "Por favor, rellene el campo",
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }

        this.listaPokemonsFiltro = this.listaPokemon.filter(pk => pk.nombre.includes(filtro));
        if (this.listaPokemonsFiltro.length === 0) {
            Toast.fire({
                icon: "error",
                title: "No se econtró pokemon con el nombre "+ filtro,
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }
        document.getElementById('filtro-input').value='';
        this.actualizarPokedex();

    }

    //metodo para filtrar pokemon por id
    #filtroPorId()
    {
        const filtro_entrada = document.getElementById('filtro-input').value;
      
        if (!filtro_entrada) {
            Toast.fire({
                icon: "error",
                title: "Por favor, rellene el campo",
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }
        else if(isNaN(filtro_entrada)){
            Toast.fire({
                icon: "error",
                title: "Solo puede ingresar numeros",
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }
        else if(filtro_entrada>150 || filtro_entrada<1){
            Toast.fire({
                icon: "error",
                title: `El ID ${filtro_entrada} no existe`,
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }
        else{
            document.getElementById('filtro-input').value='';
            this.listaPokemonsFiltro = this.listaPokemon.filter(pk => pk.id == filtro_entrada);
        }
        
        this.actualizarPokedex();
    }

    // Método para filtrar Pokémon por tipo
    #filtroPorTipo()
    {
        const filtro_entrada = document.getElementById('filtro-input').value.toLowerCase();

        if (!filtro_entrada) {
            Toast.fire({
                icon: "error",
                title: "Por favor, rellene el campo",
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            return;
        }

        this.listaPokemonsFiltro = this.listaPokemon.filter(pk => pk.tipos.includes(filtro_entrada));
        if (this.listaPokemonsFiltro.length === 0) {
            Toast.fire({
                icon: "error",
                title: "No se econtraron pokemons del tipo "+ filtro_entrada,
            });
            this.listaPokemonsFiltro = [...this.listaPokemon];
            document.getElementById('filtro-input').value='';
            return;
        }
        document.getElementById('filtro-input').value='';
        this.actualizarPokedex();
    }

    // Método para limpiar filtros
    #limpiarFiltro()
    {
        this.listaPokemonsFiltro = [...this.listaPokemon]; // Restablecer lista de filtrados a la lista completa
        const limpiar = document.getElementById('filtro-input');
        limpiar.value = '';
        this.actualizarPokedex();

    }

        // Método para actualizar la Pokedex
    actualizarPokedex() {
        const Elemento_pokedex = document.getElementById('pokedex');
        Elemento_pokedex.innerHTML = '';

        // Dibujar cada Pokémon
        if (Array.isArray(this.listaPokemonsFiltro)) {
            this.listaPokemonsFiltro.forEach(x => this.#dibujarPk(Elemento_pokedex, x));
        } else {
            console.error('listaPokemonsFiltro no es un array');
        }   
    }

}

