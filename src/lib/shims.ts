import { invoke as tauriInvoke, type InvokeArgs, type InvokeOptions } from "@tauri-apps/api/core";
import { listen as tauriListen, type EventCallback, type EventName, type Options, type UnlistenFn } from "@tauri-apps/api/event";
import { LogicalSize, PhysicalSize, getCurrentWindow as tauriGetCurrentWindow, Window as TauriWindow } from "@tauri-apps/api/window";
import { onOpenUrl as tauriOnOpenUrl } from "@tauri-apps/plugin-deep-link";
import type { ConfirmDialogOptions, MessageDialogOptions, MessageDialogResult, OpenDialogOptions, OpenDialogReturn } from "@tauri-apps/plugin-dialog";
import { ask as tauriAsk, message as tauriMessage, open as tauriOpen } from "@tauri-apps/plugin-dialog";
import { listenServerSentEvents } from "./listenServerSentEvents";
import { invokeServerAction } from "./invokeServerAction";
import { argsHasUrlString } from "./validators";
import { dialogAsk, dialogMessage, dialogOpen } from "./dialogActions";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:57114";

const buildTarget = import.meta.env.VITE_BUILD_TARGET || "tauri";
export const isTauri = buildTarget === "tauri";
export const isCli = buildTarget === "cli";

if (isTauri) {
	globalThis.open = (url?: string | URL) => {
		if (url) tauriInvoke("open_url", { url });
		return null;
	};
}

export async function invoke<T>(cmd: string, args?: InvokeArgs, options?: InvokeOptions): Promise<T> {
	if (isTauri) {
		return await tauriInvoke(cmd, args, options);
	}

	if (argsHasUrlString(args)) {
		window.open(args.url, "_blank", "noopener,noreferrer");
		return undefined as T;
	}

	return await invokeServerAction<T>(cmd, args, options);
}

export async function listen<T>(event: EventName, handler: EventCallback<T>, options?: Options): Promise<UnlistenFn> {
	if (isTauri) {
		return await tauriListen(event, handler, options);
	}

	return await listenServerSentEvents<T>(`/events`, event, handler);
}

export function getCurrentWindow(): TauriWindow {
	if (isTauri) {
		return tauriGetCurrentWindow();
	}

	const dummyWindow = {
		setMinSize: (_size: LogicalSize) => Promise.resolve(),
		innerSize: () => Promise.resolve(new PhysicalSize(1024, 768)),
		setSize: (_size: LogicalSize) => Promise.resolve(),
	} as unknown as TauriWindow;

	return dummyWindow;
}

export async function onOpenUrl(handler: (urls: string[]) => void): Promise<UnlistenFn> {
	return await tauriOnOpenUrl(handler);
}

export async function ask(message: string, options?: string | ConfirmDialogOptions): Promise<boolean> {
	if (isTauri) {
		return await tauriAsk(message, options);
	}

	return await dialogAsk(message, options);
}


export async function message(message: string, options?: string | MessageDialogOptions): Promise<MessageDialogResult> {
	if (isTauri) {
		return await tauriMessage(message, options);
	}

	return await dialogMessage(message, options);
}

export async function open<T extends OpenDialogOptions>(options?: T): Promise<OpenDialogReturn<T>> {
	if (isTauri) {
		return await tauriOpen(options);
	}

	return await dialogOpen(options);
}
