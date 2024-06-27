function crearRow(){
    let row=document.createElement('div');
    row.classList.add('row','mx-1','border','mb-3');

    return row;
}

function crearCol(nombre,id){
    let col=document.createElement('div');
    col.classList.add('col-12', 'border', 'p-2');
    col.innerHTML=`
        <div class="d-flex justify-content-between border-bottom" id="${id}">
            <h5 class="align-baseline">${nombre}</h5>
            <div class="mx-2">
                <i class="bi bi-x-circle mx-1 fs-4 eliminar"></i>
                <i class="bi bi-pencil fs-4 modificar"></i>
            </div>
        </div>
        <p>Pokemones Asignados</p>
        <p class="text-center">No tiene pokemones asignados</p>
    `;

    return col;
}

function crearCol2(nombre,id){
    let col=document.createElement('div');
    col.classList.add('col-lg-6', 'col-xs-12', 'col-sm-12', 'border', 'p-2');
    col.innerHTML=`
        <div class="d-flex justify-content-between border-bottom" id="${id}">
            <h5 class="align-baseline">${nombre}</h5>
            <div class="mx-2">
                <i class="bi bi-x-circle mx-1 fs-4 eliminar"></i>
                <i class="bi bi-pencil fs-4 modificar"></i>
            </div>
        </div>
        <p>Pokemones Asignados</p>
        <p class="text-center">No tiene pokemones asignados</p>
    `;

    return col;
}

function contenedorPokemones(){
    let div=document.createElement('div');
    div.classList('container','d-flex','justify-content-center','flex-wrap','p-2','border','border-warning-subtle','border-3','rounded','mb-3');
    div.setAttribute('id','pokemones');
}

export {crearRow,crearCol,crearCol2,contenedorPokemones};