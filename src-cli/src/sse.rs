use axum::response::sse::{Event, Sse};
use futures::Stream;
use futures::StreamExt;
use once_cell::sync::Lazy;
use std::convert::Infallible;
use tokio::sync::broadcast;
use tokio_stream::wrappers::BroadcastStream;

/// Global broadcast channel for SSE messages.
static SSE_BROADCAST: Lazy<broadcast::Sender<String>> = Lazy::new(|| {
    // buffer size 100; adjust if needed
    broadcast::channel(100).0
});

/// Publish a string message to all connected SSE clients.
pub fn publish_sse_event(message: String) {
    let _ = SSE_BROADCAST.send(message);
}

/// Create an `Sse` response streaming messages published via `publish_sse_event`.
pub fn sse_stream() -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let rx = SSE_BROADCAST.subscribe();
    let stream = BroadcastStream::new(rx).filter_map(|res| async move {
        match res {
            Ok(msg) => Some(Ok(Event::default().data(msg))),
            Err(_) => None,
        }
    });

    Sse::new(stream)
}
