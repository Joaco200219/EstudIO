# Version 1.0.2 (2026-08-25)
- Esta versión corrige algunos errores existentes en el código, como se describe más adelante. 
- También incluye una funcionalidad de guardado rápido mediante CTRL+S (también CMD+S en macOS) disponible mientras se edita un apunte.
- Finalmente se incorpora la verificación de actualizaciones. Al iniciar la app, verifica y en caso de que exista una nueva versión, consulta si se quiere actualizar. Si se acepta, se descarga e instala la nueva version, aunque tambien se puede posponer pulsando el botón "Más tarde". **Esto esta en versión de prueba, pueden haber errores** 


# FUNCIONALIDADES NUEVAS
- **Funcionalidad:** Nuevo atajo de teclado CTRL+S (también CMD+S en macOS) disponible mientras se edita un apunte. Al pulsarlo se guarda el apunte actual mediante la función `guardarApunteActual()` (`src/main.ts`), sin cerrar el editor.
- **Detalles:** El atajo solo está activo cuando hay un apunte abierto en el editor; fuera de él las teclas no se capturan. Se usa `preventDefault()` para evitar el diálogo nativo de guardado del navegador. La opción de guardar y cerrar (`btn-editor-guardar-cerrar`) mantiene su comportamiento original y no se ve afectada por el atajo.

# FIX
- **Error:** Al exportar una nota como ZIP, el archivo conservaba rutas absolutas de imágenes (`asset://localhost/...`). Al importar el ZIP en otra máquina, esas rutas eran inválidas y las imágenes no se mostraban.
- **Solución:** En la función `extraer_zip` (`src-tauri/src/lib.rs`), tras extraer el ZIP en el directorio destino, se lee el apunte y se normalizan las rutas de las imágenes a rutas relativas a la carpeta `.recursos` (usando `/`, compatible con markdown/HTML en Windows, macOS y Linux), antes de registrar la nota en la base de datos.

# Version 1.0.0 (2026-07-11)
Esta es la primera versión de EstudIO que no es una version de prueba. De las versiones anteriores se llegan las siguientes funcionalidades ya testeadas:
- Capacidad de crear apuntes, formatear el texto e inclusive resaltarlo.
- Capacidad de agregar imágenes mediante CTRL+V o seleccionando desde el explorador de archivos.
- Capacidad de crear recordatorios que se muestran en la barra lateral si la fecha de recordatorio es la fecha del dia actual.
