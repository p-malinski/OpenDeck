import type { InvokeArgs, InvokeOptions } from "@tauri-apps/api/core";
import axios from "axios";
import { apiBaseUrl } from "./shims";

axios.defaults.baseURL = apiBaseUrl;

export async function invokeServerAction<T>(cmd: string, args?: InvokeArgs, options?: InvokeOptions): Promise<T> {
    const response = await axios.post(`/invoke/${cmd}`, {
        args
    });

    return response.data;
};