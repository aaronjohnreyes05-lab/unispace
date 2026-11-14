# UniSpace — Student Productivity & Developer Workspace

**UniSpace** is an all-in-one digital workspace designed to bring student productivity, learning resources, AI-related workflows, developer utilities, and personal organization into one platform.

Built with React and Vite, UniSpace provides a modular interface with Supabase-powered authentication and profile management.

## Features

### Workspace Modules
- **Dashboard** — A central overview of workspace activity and progress.
- **Roadmap Studio** — Organize and explore learning roadmaps.
- **AI Workspace** — A dedicated space for AI-related workflows.
- **Education Center** — Access educational and learning tools.
- **Developer Tools** — Utilities for programming and development tasks.
- **Document Studio** — A dedicated workspace for document-related tasks.
- **Productivity Hub** — Manage tasks and personal productivity.
- **Favorites** — Quickly access starred workspace modules.

### User Experience
- Responsive sidebar navigation with collapsible layout.
- Global search and Command Palette.
- Keyboard shortcuts:
  - `Ctrl + K` — Global Search
  - `Ctrl + Shift + P` — Command Palette
- Notifications interface.
- Page transitions and interface animations.
- Customizable interface accent colors.
- Responsive layouts for different screen sizes.

### Authentication & Profiles
- Supabase authentication.
- User registration and login.
- Protected application routes.
- User profile management.
- Profile picture uploads.
- Avatar display across the Navbar and Sidebar.

### Data Management
- Local workspace data management.
- Data export and import.
- Storage information display.
- Profile and account settings.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | User interface |
| Vite 6 | Development server and build tool |
| Tailwind CSS | Styling |
| React Router | Application routing |
| Supabase | Authentication, database, and storage |
| Lucide React | Icons |
| Recharts | Data visualization |
| React Flow | Interactive flow-based interfaces |
| Monaco Editor | Code editing |
| React Markdown | Markdown rendering |
| DOMPurify | HTML sanitization |

## Requirements

Before running UniSpace locally, install:

- Node.js 18 or later
- npm
- Git
- VS Code or another code editor
- A Supabase project

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/aaronjohnreyes05-lab/unispace.git
```

### 2. Open the project directory

```bash
cd unispace
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root.

You can use `.env.example` as your template.

Add your Supabase project credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with the corresponding credentials from your Supabase project.

**Important:** Never commit your `.env.local` file or expose secret service-role keys in frontend code.

### 5. Configure Supabase

UniSpace requires a properly configured Supabase project.

Before using authentication and profile features:

1. Configure the database tables expected by the application.
2. Enable appropriate Row Level Security (RLS) policies.
3. Configure authentication settings.
4. Add the `avatar_url` column to `public.profiles` if it does not already exist:

```sql
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

For profile-picture uploads:

1. Open Supabase Storage.
2. Create a bucket named `avatars`.
3. Configure it as a public bucket.
4. Set the upload size limit to 5 MB.
5. Allow JPEG, PNG, and WebP images.
6. Configure Storage policies so authenticated users can manage only their own avatar files.

The application expects the profile and Storage configuration to be in place.

### 6. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |

## Production Build

To generate the production-ready application:

```bash
npm run build
```

To preview the generated build:

```bash
npm run preview
```

The production files are generated in the `dist/` directory.

## Deployment

UniSpace can be deployed using platforms such as Vercel.

General deployment steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required Supabase environment variables.
4. Deploy the application.
5. Configure your Supabase authentication redirect URLs for your deployed domain.

Make sure your production Supabase configuration and security policies are properly configured before deployment.

## Project Structure

```text
unispace/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## Project Goals

UniSpace aims to provide a unified environment where students and developers can organize their learning, manage their work, access useful tools, and maintain their productivity without constantly switching between different applications.

The project is continuously evolving, with additional improvements and features planned.

## Author

**Aaron John Ezekiel B. Reyes**

GitHub: [@aaronjohnreyes05-lab](https://github.com/aaronjohnreyes05-lab)

## Repository

[https://github.com/aaronjohnreyes05-lab/unispace](https://github.com/aaronjohnreyes05-lab/unispace)