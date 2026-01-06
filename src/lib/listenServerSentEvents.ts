import type { EventCallback } from "@tauri-apps/api/event";
import { apiBaseUrl } from "./shims";

const _sseConnections: Map<string, EventSource> = new Map();
const _sseListeners: Map<
    string,
    Map<string, Map<EventCallback<any>, EventListener>>
> = new Map();

export function listenServerSentEvents<T = any>(
    path: string,
    eventName: string,
    handler: EventCallback<T>,
    onError?: (err: any) => void
): () => void {
    const base = apiBaseUrl;
    const url = path.startsWith("http") ? path : `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    const connectionKey = url;

    let eventSource = _sseConnections.get(connectionKey);
    if (!eventSource) {
        eventSource = new EventSource(url);
        eventSource.onerror = (err) => {
            if (onError) onError(err);
        };
        _sseConnections.set(connectionKey, eventSource);
        _sseListeners.set(connectionKey, new Map());
    }

    const eventMap = _sseListeners.get(connectionKey)!;
    let handlerMap = eventMap.get(eventName);
    if (!handlerMap) {
        handlerMap = new Map();
        eventMap.set(eventName, handlerMap);
    }


    const wrapperListener: EventListener = (e: Event) => {
        const messageEvent = e as MessageEvent;
        let payload: any;
        try {
            payload = JSON.parse(messageEvent.data);
        } catch {
            payload = messageEvent.data;
        }
        const tauriEvent = { event: eventName, payload } as any;
        try { handler(tauriEvent); } catch { /* swallow */ }
    };

    handlerMap.set(handler as EventCallback<any>, wrapperListener);
    eventSource.addEventListener(eventName, wrapperListener);

    return () => {
        const listenersForUrl = _sseListeners.get(connectionKey);
        if (!listenersForUrl) {
            return;
        }

        const handlersForEvent = listenersForUrl.get(eventName);
        if (!handlersForEvent) {
            return;
        }

        const wrapperListenerRef = handlersForEvent.get(handler as EventCallback<any>);
        if (wrapperListenerRef && eventSource) {
            eventSource.removeEventListener(eventName, wrapperListenerRef);
        }

        handlersForEvent.delete(handler as EventCallback<any>);

        if (handlersForEvent.size === 0) {
            listenersForUrl.delete(eventName);
        }

        if (listenersForUrl.size === 0) {
            if (eventSource) {
                try {
                    eventSource.close();
                }
                catch (err) {
                    console.error(`Failed to close SSE connection for ${connectionKey}:`, err);
                }
            }
            _sseConnections.delete(connectionKey);
            _sseListeners.delete(connectionKey);
        }
    };
}