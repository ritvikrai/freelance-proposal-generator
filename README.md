# Freelance Proposal Generator

AI-powered proposal generation for freelancers to win more clients.

## Features

- ✍️ Generate professional proposals from job descriptions
- 👤 Save your profile for personalized proposals
- 📝 Multiple tone options (professional, friendly, persuasive)
- 📚 Proposal history and management
- 🎯 Tailored to your skills and experience

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate a proposal |
| GET/POST | `/api/profile` | Manage freelancer profile |
| GET | `/api/proposals` | Get proposal history |

## Demo Mode

Works without API key with template-based proposals.

## License

MIT
