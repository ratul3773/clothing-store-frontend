export { cn } from "cn"

export const bdt = (n: number) => `৳${n.toLocaleString('en-US')}`

export function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === 'object' && error !== null) {
        const err = error as {
            data?: { message?: string, data?:{description?: string} };
            error?: string;
            message?: string;
        };
        if (err.data?.data?.description) return err.data.data.description;
        if (err.data?.message) return err.data.message;
        if (err.error) return err.error;
        if (err.message) return err.message;
    }
    return fallback;
}