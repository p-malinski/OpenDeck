export function argsHasUrlString(args: unknown): args is { url: string } {
    return (
        typeof args === "object" &&
        args !== null &&
        "url" in args &&
        typeof args.url === "string"
    );
}