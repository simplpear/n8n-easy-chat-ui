# n8n chat: Custom Web UI for n8n Webhooks
![n8nui](https://github.com/user-attachments/assets/dfa93602-9207-4e96-bcd4-841c7d026327)

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

## Architecture & Data Storage

This application is a **client-side only React application**. It does not require a dedicated backend server for its own operations.

*   **Communication:** It interacts directly with your specified n8n webhook URL for sending and receiving messages.
*   **Data Persistence:**
    *   **Chat History:** Messages, including attachments (converted to Base64 for persistence), are saved in the browser's **Local Storage**. This means the chat history is stored on the user's own computer and is specific to their browser.
    *   **Settings:** All configuration options (Webhook URL, Cloudflare credentials, chat name, emoji, etc.) are also stored in Local Storage.

This approach simplifies deployment and usage, as no backend infrastructure needs to be maintained for the chat UI itself.

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
    git clone https://github.com/simplpear/n8n-easy-chat-ui.git
    cd n8n-easy-chat-ui
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsimplpear%2Fn8n-easy-chat-ui%2Ftree%2Fmain)

## License

This project is provided for personal, non-commercial use only. You may modify it for your own personal use. Redistribution or use for commercial purposes is not permitted.
