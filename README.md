# Frontend (Angular 17 Standalone)

## Arquitecture y Tecnologías
* **Framework:** Angular 17.3.x (Standalone y Signals).
* **Estilos y Layout:** Bootstrap 5.3.x (vía CDN).
* **Iconografía:** Bootstrap Icons (vía CDN).
* **Modales y UX:** SweetAlert2 (vía CDN).

## Pasos para Ejecutar el Proyecto Frontend
*(Asegúrate de tener Node.js 18+ instalado en tu máquina)*

1. Abre una terminal en tu máquina y navega hasta la raíz de este directorio (productos-front).
2. Instala las dependencias y módulos locales:
  ```Bash
    npm install
  ```
3. Levanta el servidor local de desarrollo utilizando el CLI local del proyecto:

  ```Bash
    npx ng serve
  ```
4. Accede al aplicativo:
Una vez completada la compilación, abre tu navegador web e ingresa a la siguiente dirección:
http://localhost:4200

Nota: Asegúrate de tener corriendo en paralelo el servicio backend en el puerto 8080 para que las peticiones HTTP respondan.
