export const UserService = {
    async getAll() {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiUrl}/users`);
    },

    async getById(id: number) {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiUrl}/users/${id}`);
    },

    async create(user: { username: string; email: string }) {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiUrl}/users`, {
            method: "POST",
            body: user,
        });
    },

    async delete(id: number) {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiUrl}/users/${id}`, { method: "DELETE" });
    },
};