import { defineStore } from "pinia";
import { PollService } from "@/services/PollService";
import type { Poll } from "@/types/PollType";

export const usePollStore = defineStore("poll", {
    state: () => ({
        polls: [] as Poll[],
        selectedPoll: null as Poll | null,
    }),
    actions: {
        async fetchPolls() {
            this.polls = await PollService.getAll();
        },
        async fetchPoll(id: number) {
            this.selectedPoll = await PollService.getById(id);
        },
        async createPoll(userId: number, poll: { question: string; options: string[] }) {
            const newPoll = await PollService.create(userId, poll);
            this.polls.push(newPoll);
        },
        async deletePoll(id: number) {
            await PollService.delete(id);
            this.polls = this.polls.filter((p) => p.id !== id);
        },
    },
});
