"use client";
import { usePathname } from "next/navigation";
import { useStore } from "../providers/StoreProvider";
import { Button } from "../ui/button";

export default function AuthFormTrigger() {
    const { setAuthOpen } = useStore();
    const pathname = usePathname();
    return (
        pathname !== "/login/" &&
            <Button
                aria-label="Login"
                size="sm"
                onClick={() => setAuthOpen(true)}
            >
                Sign in
        </Button>
    );
}