'use server';

import axios from 'axios';

export async function me(accessToken: string) {
    const apiClient = axios.create({
        baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:8080', // Replace with your API base URL
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken
        },
    });

    return await apiClient.get('/users/me');
}
