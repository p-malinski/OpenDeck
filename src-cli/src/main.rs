use tracing_subscriber;
use tracing::info;

mod handlers;
mod router;
mod sse;

#[tokio::main]
async fn main() {
	let server_address = "127.0.0.1:57114";

	// initialize tracing
	tracing_subscriber::fmt::init();

	let app_router = router::build_router();
	let tcp_listener = tokio::net::TcpListener::bind(server_address).await.unwrap();

	info!("Server listening on {}", server_address);
	axum::serve(tcp_listener, app_router).await.unwrap();
}
