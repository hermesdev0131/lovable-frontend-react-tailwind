# Welcome to your Lovable project

A modern React-based frontend for the Contact Pipeline Haven application, featuring a beautiful UI built with shadcn-ui and Tailwind CSS.

## Features

- Modern, responsive UI with dark mode support
- Real-time activity feed
- Task management and tracking
- Team collaboration features
- Contact management
- Email integration
- Settings and user preferences

## Tech Stack

- **Core**:
  - Vite
  - TypeScript
  - React
  - React Router
  - React Query

- **UI/UX**:
  - shadcn-ui
  - Tailwind CSS
  - Lucide Icons
  - React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Navigate to the frontend directory:
```sh
cd frontend
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

- Development server runs on port 5173
- Hot module replacement (HMR) enabled
- TypeScript for type safety
- ESLint and Prettier for code formatting

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/             # Static assets
└── index.html          # Entry HTML file
```

## UI Components

The project uses shadcn-ui components, which are built on top of Radix UI and styled with Tailwind CSS. Key components include:

- Cards
- Buttons
- Forms
- Modals
- Toast notifications
- Dropdowns
- Tables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
