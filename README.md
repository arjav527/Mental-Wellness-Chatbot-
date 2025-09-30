#🧠 Mental Wellness Chatbot
A compassionate and interactive chatbot designed to provide support and resources for mental well-being. Built with modern web technologies to deliver a seamless and responsive user experience.

(Suggestion: Create a short GIF of your app and replace the link above)

✨ Overview
This project is a web-based chatbot application aimed at providing a safe space for users to express their feelings and receive helpful information related to mental health. It leverages the power of AI to understand user inputs and provide supportive responses, resources, and coping strategies. The backend is powered by Supabase, allowing for easy data management and user authentication.

🚀 Features
Interactive Chat Interface: A clean, user-friendly interface for seamless conversation.

AI-Powered Responses: Integrates with a language model to provide empathetic and relevant replies.

Resource Library: Offers links to articles, hotlines, and professional help.

User Accounts: (Optional, via Supabase) Allows users to save their conversation history and track their mood over time.

Responsive Design: Fully accessible on both desktop and mobile devices.

🛠️ Tech Stack
Frontend: Vite + React + TypeScript

Styling: Tailwind CSS

Backend & Database: Supabase

Package Manager: Bun

⚙️ Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing purposes.

Prerequisites
You must have Node.js (v18+) and Bun installed on your machine.

A free Supabase account to set up your own database and backend.

1. Clone the Repository
Bash

git clone https://github.com/arjav527/Mental-Wellness-Chatbot-.git
cd Mental-Wellness-Chatbot-
2. Install Dependencies
Install the required packages using Bun.

Bash

bun install
3. Set Up Environment Variables
This project requires a Supabase backend.

Create a new project on Supabase.

Go to your project's API Settings (Settings > API).

Find your Project URL and anon public key.

In your local project, create a file named .env in the root directory by copying the example file:

Bash

cp .env.example .env 
(Note: If you don't have a .env.example, just create a new file named .env)

Add your Supabase keys to the .env file:

Code snippet

VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
4. Run the Development Server
Start the local development server.

Bash

bun run dev
The application should now be running on http://localhost:5173 (or another port if 5173 is in use).

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
