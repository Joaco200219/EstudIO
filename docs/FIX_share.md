# Fix for ZIP Export/Import Image Paths

During ZIP export, the note file retains absolute image paths (asset://localhost/...). When imported on another machine, these paths are invalid.

Solution: In the `extraer_zip` function (src-tauri/src/lib.rs), after extracting the ZIP to the user-selected destination directory, read the extracted note file, normalize all image paths to be relative to the `.recursos` folder using forward slashes (which work in markdown/HTML on all OS), and write the updated content back before registering the note in the database.

Steps:
1. After `archive.extract(Path::new(&ruta_destino))?`, compute the note file path: `let note_path = Path::new(&ruta_destino).join(format!("{}.md", nombre_apunte));`
2. Read the note content.
3. For each line, replace any image URL pattern (e.g., `asset://localhost/%2F...%2F.recursos%2F<filename><ext>`) with the relative path `.recursos/<filename><ext>`.
   - This can be done by locating `%2F.recursos%2F`, extracting the filename+extension that follows, and reconstructing the attribute value with forward slash as separator.
4. Write the modified content back to `note_path`.
5. Proceed with `crear_apunte` as before.

This ensures that after import, the note references images using the correct relative paths (with forward slashes), independent of the absolute location on the target machine and works on Windows, macOS, and Linux.

We should also consider updating the export side (`crear_zip`) to store normalized paths in the note inside the ZIP, but the import-side fix alone resolves the issue for cross‑machine sharing.