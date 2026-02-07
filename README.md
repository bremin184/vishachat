ChatVisha
Project Overview

ChatVisha is a web-based real-time video chat and multiplayer game platform built with React, TypeScript, Tailwind CSS, and shadcn/ui.
It allows users to participate in video calls while playing interactive multiplayer games. The platform emphasizes modularity, responsive design, and smooth user experience for both video communication and gaming.

Features

Real-time video chat with multiple participants

Integrated multiplayer games, including:

Connect Four

Hangman

Memory Match

Rock Paper Scissors

Tic Tac Toe

Trivia Game

Word Chain

Would You Rather

Responsive UI built with Tailwind CSS

Component-driven design using shadcn/ui for modularity

Context-based state management for global app state

Accessible and maintainable codebase with TypeScript type safety

Project Structure
src/
├─ components/      # UI components, games, modals, video components
├─ context/         # App context and custom hooks
├─ pages/           # Page-level components (VideoChat, GamePlay, Lobby, etc.)
├─ data/            # Mock data and game definitions
├─ hooks/           # Custom hooks (e.g., use-toast, use-mobile)
├─ lib/             # Utility functions
├─ types/           # Type definitions
├─ main.tsx         # Application entry point
├─ App.tsx          # Root component


Other key files:

tailwind.config.ts — Tailwind configuration

vite.config.ts — Vite configuration

package.json — Project dependencies and scripts

README.md — Project documentation

Installation

Clone the repository:

git clone https://github.com/your-username/chatvisha.git
cd chatvisha


Install dependencies:

npm install


Start the development server:

npm run dev


Open your browser and navigate to:

http://localhost:8080

Available Scripts

npm run dev — Start development server with hot-reloading

npm run build — Build production-ready assets

npm run preview — Preview production build locally

npm run test — Run automated tests (Vitest)

npm run lint — Run ESLint for code quality

Contributing

Fork the repository and create a feature branch:

git checkout -b feature/your-feature-name


Make your changes and test thoroughly

Commit your changes with clear messages

Push your branch and create a pull request

All contributions should maintain code readability, modularity, and TypeScript type safety.

Technologies Used

React — Frontend library for UI development

TypeScript — Strongly-typed JavaScript for maintainability

Tailwind CSS — Utility-first CSS framework

Vite — Fast frontend build tool

shadcn/ui — Component library for consistent UI

React Router DOM — Client-side routing

React Query (TanStack) — Data fetching and caching

Vitest — Unit testing framework

Notes

The project uses a modular component structure to simplify maintenance and future feature expansion.

All UI elements use Tailwind utility classes and adhere to responsive design principles.

Video chat functionality is integrated alongside games in a flexible layout, ensuring both players maintain visibility during gameplay.

License

This project is licensed under the MIT License.
