import { invoke as tauriInvoke, type InvokeArgs, type InvokeOptions } from "@tauri-apps/api/core";
import { listen as tauriListen, type EventCallback, type EventName, type Options, type UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow as tauriGetCurrentWindow, Window as TauriWindow } from "@tauri-apps/api/window";
import { onOpenUrl as tauriOnOpenUrl } from "@tauri-apps/plugin-deep-link";
import type { ConfirmDialogOptions, MessageDialogOptions, MessageDialogResult, OpenDialogOptions, OpenDialogReturn } from "@tauri-apps/plugin-dialog";
import { ask as tauriAsk, message as tauriMessage, open as tauriOpen } from "@tauri-apps/plugin-dialog";

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
	return await tauriInvoke(cmd, args, options);
}

export async function listen<T>(event: EventName, handler: EventCallback<T>, options?: Options): Promise<UnlistenFn> {
	return await tauriListen(event, handler, options);
}

export function getCurrentWindow(): TauriWindow {
	return tauriGetCurrentWindow();
}

export async function onOpenUrl(handler: (urls: string[]) => void): Promise<UnlistenFn> {
	return await tauriOnOpenUrl(handler);
}

export async function ask(message: string, options?: string | ConfirmDialogOptions): Promise<boolean> {
	return await tauriAsk(message, options);
}


export async function message(message: string, options?: string | MessageDialogOptions): Promise<MessageDialogResult> {
	return await tauriMessage(message, options);
}

export async function open<T extends OpenDialogOptions>(options?: T): Promise<OpenDialogReturn<T>> {
	return await tauriOpen(options);
}
