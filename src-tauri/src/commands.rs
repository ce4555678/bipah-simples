use image::imageops::FilterType;
use webp::Encoder;

#[tauri::command]
pub fn compress_image(
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