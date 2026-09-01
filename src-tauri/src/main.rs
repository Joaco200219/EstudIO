#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    {
        // Evita el error EGL_BAD_PARAMETER / pantalla en blanco en WebKitGTK (drivers NVIDIA, Wayland, etc.)
        if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }

    estudio_lib::run();
}
