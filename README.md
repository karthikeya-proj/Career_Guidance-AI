
#  CareerBuddy – Offline AI Chatbot using LLaMA3 & Ollama

CareerBuddy is a fully offline, intelligent AI chatbot powered by the open-source **LLaMA3 model** via [Ollama](https://ollama.com/). Built using **React**, **TypeScript**, and **Vite**, it features a fast, modern interface with voice input, text-to-speech responses, local chat history, and reaction feedback — all running locally with **no internet or cloud dependencies**.

## Live demo

[Live demo](https://drive.google.com/file/d/1rzrj8tCtwnr8y_MpBjxJlTlBXGzzdoCf/view?usp=sharing)


---

## 👨‍💻 Team Members

| Name                  | Email                         |
|-----------------------|-------------------------------|
| G. Jahnavi            | jahnavi0405@gmail.com         |
| C. Sania              | Csania715@gmail.com           |
| R. Lohith             | lohithrayavaram264@gmail.com  |
| P. Naga Karthikeya    | eyakarthik872@gmail.com       |
| B. Suraj Naik         | surajnaikb19@gmail.com        |

---

## 📌 Project Description

CareerBuddy is designed to help users explore career paths, answer questions, and receive AI-powered guidance in a secure and private environment. Unlike typical AI chatbots that require online APIs, this solution runs entirely offline using the **LLaMA3 model** served through **Ollama**.

This makes it an ideal choice for **privacy-conscious users**, **schools**, **labs**, or any setup where **internet access is restricted** or **data privacy is critical**.

---

##  Use Cases

-  **Career Counseling Assistant** – Offers AI-powered career guidance.
-  **Private & Secure Chatbot** – Keeps conversations fully offline and local.
-  **LLM Testing Sandbox** – Run open-source LLMs in a controlled environment.
-  **Voice-Based Learning** – Ideal for educational tools and speech-based interactions.
-  **Offline Productivity Tool** – Works even in disconnected or low-connectivity regions.

---

##  Features

###  100% Offline and Secure
- Powered by [Ollama](https://ollama.com/) and the **LLaMA3** open-source model.
- No internet, no APIs, no third-party data sharing.

###  LLaMA3 AI Integration
- Natural language understanding via `ollama.ts` utility.
- Communicates with a local LLM server (`ollama run llama3`).

###  Voice Input &  Text-to-Speech Output
- Uses the Web Speech API:
  - `speech.ts` handles **speech recognition** and **synthesis**.
  - Speak to the bot and hear it respond.

###  Chat Interface (React + Tailwind CSS)
- Components like `ChatInterface.tsx`, `MessageBubble.tsx`, and `VoiceControls.tsx` power a sleek, responsive UI.
- Auto-scroll, timestamps, and typing indicators enhance UX.

### Persistent Chat History
- Chat history is saved using `storage.ts` in `localStorage`.
- Conversations persist even after page reloads.

###  Reaction Buttons
- Users can provide feedback on responses with emojis (👍 👎).
- Helps capture response quality and satisfaction locally.


##  Setting Up LLaMA3 Locally with Ollama

To power CareerBuddy offline using the **LLaMA3 model**, you'll need to install [Ollama](https://ollama.com/), which serves open-source LLMs through a local API. Below are the complete setup steps to get LLaMA3 running on your machine.

---

###  Prerequisites

-  OS: macOS, Windows 10/11, or Linux
-  Minimum 8 GB RAM (16+ GB recommended for smooth performance)
-  Node.js installed for running the frontend
-  No internet required after initial setup

---

## 🧠 About LLaMA 3

**LLaMA 3 (Large Language Model Meta AI)** is the latest open-source large language model developed by **Meta AI**, released in 2024. It offers powerful reasoning capabilities, improved language understanding, and optimized performance, making it ideal for both local and scalable applications.

LLaMA 3 is designed to be:
- 🔓 **Open-source** – Fully accessible for research, development, and commercial use.
- ⚡ **Efficient** – The 8B version runs smoothly on consumer-grade hardware.
- 💬 **Conversational** – Fine-tuned for dialogue, coding assistance, summarization, and more.

Available Model Sizes:
- `LLaMA3-8B` – Lightweight, suitable for local/offline apps like CareerBuddy.
- `LLaMA3-70B` – High-performance version for advanced enterprise/cloud applications.

---

## 🎯 LLaMA 3 Use Cases

- **Offline Chatbots** – Build privacy-first assistants that work without internet.
- **Career Guidance Systems** – Answer career-related questions and suggest paths (e.g., CareerBuddy).
- **Coding Assistants** – Help developers write and debug code locally.
- **Education Tools** – Create interactive tutors and learning platforms.
- **Content Generation** – Assist in writing articles, summaries, or emails.
- **LLM Prototyping & Testing** – Quickly test prompts and evaluate models on local systems.
- **Voice Interfaces** – Combine with speech recognition for accessible, spoken AI tools.
- **Secure Environments** – Ideal for schools, labs, or industries with strict data privacy policies.

LLaMA 3 empowers developers to create **powerful, flexible, and private AI applications** without relying on closed-source APIs or cloud services.


###  1. Install Ollama

Go to [https://ollama.com/download](https://ollama.com/download) and download the installer for your operating system:

- **Windows:** `.exe` installer
- **macOS:** `.dmg` package
 ### set up:

#### 1. Ollama installed
ollama --version

#### 2. LLaMA3 model pulled
ollama pull llama3

#### 3. Ollama LLM server running
ollama run llama3

#### 4. Frontend started in another terminal/tab
npm install
npm run dev



## 🛠️ Technologies & Languages Used

| Category        | Tools / Languages                             |
|----------------|------------------------------------------------|
| Frontend       | React, TypeScript, Vite                        |
| Styling        | Tailwind CSS                                   |
| AI Model       | LLaMA 3 (8B) via Ollama                        |
| Speech API     | Web Speech API (native browser support)        |
| State & Storage| JavaScript `localStorage`                      |
| Runtime        | Node.js (for frontend dev server)              |
| Terminal Tools | Bash, NPM, Ollama CLI                          |

---
### commands to run:
In a new terminal tab, 
* run the frontend:
* npm install
* npm run dev


---

## 🌱 Future Enhancements

Here are planned improvements and features for future releases of CareerBuddy:

- 🔐 **User Authentication**  
  Add secure login/signup to personalize user sessions and protect chat history.

- 🧠 **Persistent Memory**  
  Use databases like MongoDB or Firebase to store chat context across sessions.

- 🌍 **Multi-language Support**  
  Enable voice and text support for Indian/regional languages (e.g., Hindi, Tamil, Telugu).

- 📊 **Career Quiz Engine**  
  Ask users a series of questions to suggest career paths based on preferences and strengths.

- 🌙 **Dark Mode Toggle**  
  Add a dark/light theme switcher with `localStorage` preference save.

- 📁 **Export Conversations**  
  Let users download full chats as PDF or plain text for record-keeping or sharing.

- 📱 **Mobile-Friendly UI**  
  Improve mobile responsiveness for a better experience on small screens.

- 🧪 **Multi-Model Selection**  
  Support running different LLMs locally via Ollama (e.g., Mistral, Gemma).

- 🔔 **Reminder/Notification System**  
  For task-based use cases or career events.

- 📌 **Bookmark Important Replies**  
  Let users pin or favorite responses in the chat window.

- 🎨 **Enhanced Reactions**  
  Add custom emoji feedback and analytics dashboard for responses.

---
