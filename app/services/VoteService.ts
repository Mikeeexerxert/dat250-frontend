export const VoteService = {
    async castVote(pollId: number, userId: number, optionId: number) {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiUrl}/polls/${pollId}/vote`, {
            method: "POST",
            params: { userId, optionId },
        });
    },
};