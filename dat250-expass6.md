# DAT250 Exercise Assignment 3 Report

## Technical Problems Encountered

During the frontend implementation and integration with the backend:

- **No major technical issues** were encountered while creating the components, setting up Nuxt 3, Pinia store, or the stub data.
- Initial issues with **page redirection** and button visibility were resolved by correctly configuring the `/polls` route and ensuring components were rendered.
- CORS configuration and environment variable handling were prepared but did not require additional troubleshooting.

Overall, the development environment worked smoothly with Nuxt 3, TailwindCSS v4, Nuxt UI, and Pinia.

---

## Link to Code Repository

The code for the frontend experiments 1–2 is available at:  

[Frontend](https://github.com/Mikeeexerxert/dat250-frontend)

[Backend](https://github.com/Mikeeexerxert/dat250)

---

## Pending Issues / Future Work

Some tasks were not fully completed due to the absence of a backend database and other integration dependencies:

1. **Unit tests for components** – Components such as `CreatePoll` and `VotePoll` currently lack fully mocked unit tests with Pinia and API services.
2. **End-to-end (E2E) tests** – E2E testing for full user flows (creating polls, voting) has not been implemented.
3. **Store integration in components** – While the Pinia stores (`pollStore`, `userStore`) were implemented, their fetch actions were not fully wired into the components for live backend data.
4. **Backend dependency** – Due to the lack of a running database, the frontend cannot yet fully communicate with a real backend.

These points are planned for future work once the backend database is set up and API endpoints are stable.
