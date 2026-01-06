use axum::response::sse::{Event, Sse};
use futures::Stream;
use futures::StreamExt;
use once_cell::sync::Lazy;
use std::convert::Infallible;
use tokio::sync::broadcast;
use tokio_stream::wrappers::BroadcastStream;
use serde::Serialize;

/// Global broadcast channel for SSE messages.
static SSE_BROADCAST: Lazy<broadcast::Sender<(String, String)>> = Lazy::new(|| {
    // buffer size 100; adjust if needed
    broadcast::channel(100).0
});

/// Publish a string message to all connected SSE clients using the default event name `message`.
pub fn publish_sse_event(message: String) {
    let _ = SSE_BROADCAST.send(("message".to_string(), message));
}

/// Publish a named event with a JSON-serializable payload.
pub fn publish_named_event<T: Serialize>(event_name: &str, payload: &T) {
    if let Ok(json) = serde_json::to_string(payload) {
        let _ = SSE_BROADCAST.send((event_name.to_string(), json));
    }
}

/// Create an `Sse` response streaming messages published via `publish_sse_event`.
pub fn sse_stream() -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = SSE_BROADCAST.subscribe();
    let stream = BroadcastStream::new(rx).filter_map(|res| async move {
        match res {
            Ok((name, msg)) => Some(Ok(Event::default().event(name).data(msg))),
            Err(_) => None,
        }
    });

    Sse::new(stream)
}
