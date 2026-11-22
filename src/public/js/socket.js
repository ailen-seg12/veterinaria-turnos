const socket = io();

socket.on('servicesUpdated', (services) => {

  const container =
    document.getElementById(
      'services-container'
    );

  if (!container) {
    return;
  }


  container.innerHTML = '';


  services.forEach(service => {

    const article =
      document.createElement('article');

    article.className = 'service-card';


    const statusClass =
      service.available
        ? 'available'
        : 'unavailable';


    const statusText =
      service.available
        ? 'Disponible'
        : 'No disponible';


    article.innerHTML = `
      <div class="service-card-header">

        <h3>${service.name}</h3>

        <span class="status ${statusClass}">
          ${statusText}
        </span>

      </div>

      <p class="description">
        ${service.description}
      </p>

      <div class="service-info">

        <p>
          <strong>Duración:</strong>
          ${service.duration} minutos
        </p>

        <p>
          <strong>Precio:</strong>
          $${service.price}
        </p>

        <p>
          <strong>Categoría:</strong>
          ${service.category}
        </p>

      </div>
    `;

    container.appendChild(article);
  });
});