
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signUp(name: string, email: string, password: string) {
    const result = await auth.api.signUpEmail(
        {
            body: {
                name,
                email,
                password,
            },
        },
    )

    return result;
}

export async function signIn(email: string, password: string) {
    const result = await auth.api.signInEmail(
        {
            body: {
                email,
                password,
            },
        },
    )

    return result;
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers(),
    });
}