// Minimal handler stubs for routes requested by the user.
// Expand signatures and return types as needed later.

use reqwest::StatusCode;
use axum::response::sse::Sse;
use std::convert::Infallible;
use futures::Stream;
use crate::sse as sse_mod;

pub(crate) async fn get_categories() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn list_plugins() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_selected_profile() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn set_selected_profile() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_devices() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn create_instance() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn move_instance() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn set_state() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn remove_instance() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_build_info() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn restart() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn open_url() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn install_plugin() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn remove_plugin() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn reload_plugin() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn open_log_directory() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn show_settings_interface() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_profiles() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn delete_profile() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn rename_profile() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_applications() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_application_profiles() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn set_application_profiles() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn make_info() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn open_config_directory() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn switch_property_inspector() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn update_image() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_settings() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn set_settings() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn get_localisations() -> StatusCode {
	StatusCode::OK
}

pub(crate) async fn events() -> Sse<impl Stream<Item = Result<axum::response::sse::Event, Infallible>>> {
	sse_mod::sse_stream()
}
