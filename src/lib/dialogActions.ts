import type { ConfirmDialogOptions, MessageDialogOptions, MessageDialogResult, OpenDialogOptions, OpenDialogReturn } from "@tauri-apps/plugin-dialog";

export function dialogAsk(message: string, options?: string | ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
        const title = typeof options === "string" ? options : options?.title ?? "";
        setTimeout(() => resolve(confirm(`${title ? title + "\n\n" : ""}${message}`)), 0);
    });
}

export function dialogMessage(content: unknown, options?: string | MessageDialogOptions): Promise<MessageDialogResult> {
    return new Promise((resolve) => {
        const title = typeof options === "string" ? options : options?.title ?? "";
        const text = typeof content === "string"
            ? content
            : (content && typeof (content as any).message === "string")
                ? (content as any).message
                : String(content ?? "");
        setTimeout(() => { alert(`${title ? title + "\n\n" : ""}${text}`); resolve('Ok'); }, 0);
    });
}

export function dialogOpen<T extends OpenDialogOptions>(options?: T): Promise<OpenDialogReturn<T>> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        if (options?.multiple) input.multiple = true;
        if ((options as any)?.directory) (input as any).webkitdirectory = true;
        if ((options as any)?.filters && Array.isArray((options as any).filters)) {
            // attempt to map filters to accept string
            const accept = (options as any).filters
                .map((f: any) => Array.isArray(f.extensions) ? f.extensions.map((ext: string) => `.${ext}`).join(",") : "")
                .filter(Boolean)
                .join(",");
            if (accept) input.accept = accept;
        }

        input.style.display = "none";
        document.body.appendChild(input);

        input.addEventListener("change", () => {
            const files = Array.from(input.files || []);
            document.body.removeChild(input);

            if (!files.length) {
                resolve(null as any);
                return;
            }

            if (options?.multiple) {
                const paths = files.map((f) => (f as any).webkitRelativePath || f.name);
                resolve(paths as any);
            } else {
                const first = files[0];
                const path = (first as any).webkitRelativePath || first.name;
                resolve(path as any);
            }
        }, { once: true });

        // trigger picker
        input.click();
    });
}
