'use server';

import {z} from 'zod';
import {revalidatePath} from 'next/cache';
import axios from 'axios';
import {redirect} from 'next/navigation';

const SignUpSchema = z
    .object({
        name: z.string().min(4, "El nombre debe tener al menos 4 caracteres."),
        email: z.string().email("Email inválido. Por favor introduzca un email válido."),
        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres.")
            .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula."),
        repeat_password: z.string(),
    })
    .refine((data) => data.password === data.repeat_password, {
        message: "Las contraseñas no coinciden",
        path: ["repeat_password"], // this will map the error to the `repeat_password` field
    });

export async function signUp(formData: FormData) {
    const {name, email, password} = SignUpSchema.parse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        repeat_password: formData.get('repeat_password'),
    });

    const apiClient = axios.create({
        baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8080', // Replace with your API base URL
        timeout: 10000,
        headers: {
            "Content-Type": "application/vnd.api+json",
        },
    });

    await apiClient.post('/users/auth/signup', {
        email: email,
        name: name,
        password: password
    });

    revalidatePath('/auth/signup');
    redirect('/auth/signup');
}
