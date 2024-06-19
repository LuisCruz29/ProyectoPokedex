// Espera a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtén todos los contenedores principales por su clase
    var containers = document.querySelectorAll('.pk__container_Principal');
    var card = document.getElementById('pika__card'); // Obtén la tarjeta
    //aqui lo que podes hacer es obtener el id para que no te cueste cargar las cosas 
    // Itera sobre cada contenedor principal
    containers.forEach(function(container) {
        // Agrega un evento click a cada contenedor principal
        container.addEventListener('click', function() {
            // Muestra la tarjeta al hacer clic en cualquier contenedor principal
            card.style.display = 'block';
        });
    });
}); 

const tabs = document.querySelectorAll(".tab_btn");
const all_content = document.querySelectorAll(".content");
tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tab.classList.add('active');
        var line = document.querySelector('.line');
        line.style.width = e.target.offsetWidth + "px";
        line.style.left = e.target.offsetLeft + "px";
        
        all_content.forEach(content => {
            content.classList.remove('active');
        });
        all_content[index].classList.add('active');
    });
});