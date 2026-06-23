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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
