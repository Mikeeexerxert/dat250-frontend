import type { Poll } from "@/types/PollType";

const API_URL = useRuntimeConfig().public.API_URL;

export const PollService = {
    async getAll(): Promise<Poll[]> {
        const res = await fetch(`${API_URL}/polls`);
        return await res.json();
    },

    async getById(id: number): Promise<Poll> {
        const res = await fetch(`${API_URL}/polls/${id}`);
        return await res.json();
    },

    async create(userId: number, poll: { question: string; options: string[] }): Promise<Poll> {
        const res = await fetch(`${API_URL}/polls/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(poll),
        });
        return await res.json();
    },

    async delete(id: number): Promise<void> {
        await fetch(`${API_URL}/polls/${id}`, { method: "DELETE" });
    },
};
