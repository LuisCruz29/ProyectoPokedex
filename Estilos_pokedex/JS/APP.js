 // Espera a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtén todos los contenedores principales por su clase
    var containers = document.querySelectorAll('.pk__container_Principal');
    var card = document.getElementById('pika__card'); // Obtén la tarjeta

    // Itera sobre cada contenedor principal
    containers.forEach(function(container) {
        // Agrega un evento click a cada contenedor principal
        container.addEventListener('click', function() {
            // Muestra la tarjeta al hacer clic en cualquier contenedor principal
            card.style.display = 'block';
        });
    });
});