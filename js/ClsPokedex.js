// Importa la clase Pokemon del archivo ClsPokemon.js.
import { Pokemon } from "./ClsPokemon.js";
import {Toast} from "./alertas.js";
import { crearCuadro,cardAbout,cardStats,cardDanio } from "./plantillas.js";
import { agregarPokemon,verificarExistencia } from "./bd.js";
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
        try {
            let datos=await fetch('http://localhost:3000/pokemones').then(data=>data.json());
            this.#crearPk(datos);
        } catch (error) {
            console.error('Error al conectar al servidor',error);
        }
    }

    // creamos un metodo privado para crear un objeto pokemon y poderlo agregarlo a la lista
    #crearPk(datos)
    {
        for (const dato of datos) {
            const pk = new Pokemon(dato.idP, dato.nombreP, dato.tipoP, dato.estadistica, dato.evolucion, dato.about, dato.img,dato.relaciones);
            this.listaPokemon.push(pk);
            this.listaPokemonsFiltro.push(pk);
        }
        
        
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

        let add=document.querySelectorAll('#agregar');
        
        add.forEach(agregarP=>{
            agregarP.addEventListener('click',async (evt)=>{
                let id=evt.target.parentElement.id;
                 let pokemon=this.listaPokemon[id-1];
                let existe=await verificarExistencia(pokemon.id);

                if (existe) {
                    Swal.fire('Ya has seleccionado este pokemon como acompañante');
                }
                else{
                    Swal.fire({
                        title: "¿Desea agregar este pokemon como acompañante?",
                        showCancelButton: true,
                        confirmButtonText: "Agregar",
                        cancelButtonText: `Cancelar`
                        }).then((result) => {
                        if (result.isConfirmed) {
                            let pokemonS=JSON.stringify(pokemon);
                            agregarPokemon(pokemonS,pokemon.id);
                            Swal.fire({
                                text: "Pokemon Seleccionado",
                                icon: "success"
                            });
                        } 
                    });
                }
            });
        });

       
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

        
        
        // //audio pokemon
        // var audio = document.getElementById("poke_audi");
        // audio.play().catch(error => {
        //     alert("Error: ",error);
        // })
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

        let agregarP=document.getElementById('addPokemon');
        agregarP.addEventListener('click',async (evt)=>{
            let existe=await verificarExistencia(pokemon.id);

            if (existe) {
                Swal.fire('Ya has seleccionado este pokemon como acompañante');
            }
            else{
                Swal.fire({
                    title: "¿Desea agregar este pokemon como acompañante?",
                    showCancelButton: true,
                    confirmButtonText: "Agregar",
                    cancelButtonText: `Cancelar`
                    }).then((result) => {
                    if (result.isConfirmed) {
                        let pokemonS=JSON.stringify(pokemon);
                        agregarPokemon(pokemonS,pokemon.id);
                        Swal.fire({
                            text: "Pokemon Seleccionado",
                            icon: "success"
                        });
                    } 
                });
            }
            
            

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

