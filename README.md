# n8n chat: Custom Web UI for n8n Webhooks

This project provides a modern, responsive, and feature-rich chat interface that connects to an n8n webhook, allowing you to interact with your n8n workflows through a familiar chat experience.

**Live Demo:** [Try it here!](https://n8n-easy-chat-ui.vercel.app)

## Key Features

*   **Responsive Design:** Optimized for both desktop and mobile devices.
*   **n8n Webhook Integration:** Send and receive messages via your n8n webhook.
*   **Customizable Appearance:**
    *   Set a custom chat name and an emoji for the chat header.
    *   User and agent message bubbles with distinct styling.
*   **Rich Messaging:**
    *   Support for text messages and file attachments (images, documents, audio).
    *   Drag & drop file uploads.
    *   Voice message recording.
    *   Markdown rendering for messages, including automatic linking of URLs.
    *   Copy message content functionality.
*   **User-Friendly Interface:**
    *   Smooth animations for message appearance and modal transitions.
    *   Clear connection status indicator.
    *   Settings modal for easy configuration:
        *   Webhook URL.
        *   Cloudflare Access ID & Client Secret (optional, for securing your webhook).
        *   Toggle for typing animation effects.
        *   Emoji picker for chat icon.
*   **Chat Management:**
    *   Export and import chat history.
    *   Clear chat history.
*   **Dynamic Tab Title:** Browser tab title updates with the custom chat name.

## Technologies Used

*   **Vite:** Fast build tool and development server.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Superset of JavaScript adding static typing.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **shadcn/ui:** Re-usable UI components.
*   **Lucide React:** Icon library.
*   **emoji-picker-react:** For emoji selection.
*   **react-markdown & remark-gfm:** For rendering Markdown content.

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/simplpear/my-chat.git
    cd my-chat
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will typically be available at `http://localhost:8080/` (or the port specified by Vite).

4.  **Configure Settings:**
    *   Open the application in your browser. The settings modal should appear automatically if the webhook URL is not set.
    *   Enter your n8n Webhook URL.
    *   Optionally, configure Cloudflare Access credentials if your webhook is protected.
    *   Customize the chat name and emoji.
    *   Save the settings.

## Deployment

You can deploy this project to various platforms like Vercel, Netlify, or your own server.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimplpear%2Fmy-chat%2Ftree%2Fmain)
