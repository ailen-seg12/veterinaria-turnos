const socket = io();

socket.on('servicesUpdated', (services) => {
  const container = document.getElementById('services-container');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  services.forEach(service => {
    const article = document.createElement('article');

    article.innerHTML = `
      <h2>${service.name}</h2>
      <p>${service.description}</p>
      <p><strong>Duración:</strong> ${service.duration} minutos</p>
      <p><strong>Precio:</strong> $${service.price}</p>
      <p><strong>Categoría:</strong> ${service.category}</p>
      <p><strong>Disponible:</strong> ${service.available}</p>
    `;

    container.appendChild(article);
  });
});