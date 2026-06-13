use image::imageops::FilterType;
use webp::Encoder;
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
        let migrations = vec![  // ← ! aqui
        Migration {
            version: 1,
            description: "create_initial_tables",
        sql: include_str!("../drizzle/meta/0000_uneven_mongoose.sql"),
            kind: MigrationKind::Up,
        }
    ];


    tauri::Builder::default()
        // .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
    tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:bipahsimples.db", migrations)
        .build(),
)
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![compress_image])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn compress_image(
    image: Vec<u8>,
) -> Result<Vec<u8>, String> {

    let img =
        image::load_from_memory(&image)
            .map_err(|e| e.to_string())?;

    let resized =
        img.resize_exact(
            300,
            300,
            FilterType::Lanczos3,
        );

    let rgba =
        resized.to_rgba8();

    let encoder =
        Encoder::from_rgba(
            rgba.as_raw(),
            resized.width(),
            resized.height(),
        );

    let webp =
        encoder.encode(75.0);

    Ok(webp.to_vec())
}