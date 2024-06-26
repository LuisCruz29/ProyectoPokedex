let listaPokemons=[]
async function  getDatosPk()
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
            console.log(peticionDatos.id);
            crearObjeto(peticionDatos, dato_Especie, dato_Evolucion,danios);
            
        }
        catch (error) {
            console.error(`Error en el fetch para el Pokemon ID ${i}:`, error);
        }

    }
}


function crearObjeto(dato, especie, evolucion,danios){
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

    const imagen ={
            otroDW: dato.sprites.other.dream_world.front_default,
            otroShowdownFD: dato.sprites.other.showdown.front_default
    };

       
    const relaciones_danio={
        double_damage_from:danios.damage_relations.double_damage_from.length!==0 ? danios.damage_relations.double_damage_from.map(d=>d.name):['Ninguno'],
        double_damage_to:danios.damage_relations.double_damage_to.length!==0 ? danios.damage_relations.double_damage_to.map(d=>d.name):['Ninguno'],
        half_damage_from:danios.damage_relations.half_damage_from.length!==0 ? danios.damage_relations.half_damage_from.map(d=>d.name):['Ninguno'],
        half_damage_to:danios.damage_relations.half_damage_to.length!==0 ? danios.damage_relations.half_damage_to.map(d=>d.name):['Ninguno'],
        no_damage_from:danios.damage_relations.no_damage_from.length!==0 ? danios.damage_relations.no_damage_from.map(d=>d.name):['Ninguno'],
        no_damage_to:danios.damage_relations.no_damage_to.length!==0 ? danios.damage_relations.no_damage_to.map(d=>d.name):['Ninguno'],
    };


    let evoluciones = [];

    // inicializa cadena actual con el objeto de evolucion  recibida como argumento
    let cadena_actual = evolucion.chain;

    //  vamos iterar mientras exista una cadena de evolucion actual
    while (cadena_actual) 
    {
        // agrega el nombre de la especie actual al array de evoluciones
        evoluciones.push(cadena_actual.species.name);

        //avanza a la siguiente evolucion en la cadena (si existe)
        cadena_actual = cadena_actual.evolves_to[0];//accediendo primer elemento de evolves_to y se utiliza para avanzar la siguiente evolucion en la cadena de evolucion hasta que no haya evoluciones (null)
    }


    const objeto={
        idP:id,
        nombreP:nombre,
        tipoP:tipos,
        estadistica:Estadisticas_Base,
        evolucion:evoluciones,
        about:sobrePk,
        img:imagen,
        relaciones:relaciones_danio
    };

    listaPokemons.push(objeto);


    
}


function crearJson(){
  const fs=require("fs");
  const objeto={
    pokemones:listaPokemons
  }
  fs.writeFileSync("db.json",JSON.stringify(objeto,null,4));
}

async function programa(){
    await getDatosPk();
    crearJson();
}

programa();
