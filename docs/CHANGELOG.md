# FIX (2026-08-21)
- **Error:** Al exportar una nota como ZIP, el archivo conservaba rutas absolutas de imágenes (`asset://localhost/...`). Al importar el ZIP en otra máquina, esas rutas eran inválidas y las imágenes no se mostraban.
- **Solución:** En la función `extraer_zip` (`src-tauri/src/lib.rs`), tras extraer el ZIP en el directorio destino, se lee el apunte y se normalizan las rutas de las imágenes a rutas relativas a la carpeta `.recursos` (usando `/`, compatible con markdown/HTML en Windows, macOS y Linux), antes de registrar la nota en la base de datos.

# Version 1.0.0 (2026-07-11)
Esta es la primera versión de EstudIO que no es una version de prueba. De las versiones anteriores se llegan las siguientes funcionalidades ya testeadas:
- Capacidad de crear apuntes, formatear el texto e inclusive resaltarlo.
- Capacidad de agregar imágenes mediante CTRL+V o seleccionando desde el explorador de archivos.
- Capacidad de crear recordatorios que se muestran en la barra lateral si la fecha de recordatorio es la fecha del dia actual.
