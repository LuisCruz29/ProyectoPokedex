// Clase Pokemon que representa a un Pokémon con sus características 
export class Pokemon 
{
    // creamos un constructor de la clase pokemon 
    constructor(id, nombre, tipos,Estadistica_Base, evoluciones, sobrepk, imagen)
    {
        this.id = id;
        this.nombre = nombre;
        this.tipos = tipos;
        this.Estadisticas_Base=Estadistica_Base;
        this.evoluciones = evoluciones;
        this.sobrePk = sobrepk;
        this.imagen = imagen;
    }
}