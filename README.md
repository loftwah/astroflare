# Astroflare

![Astroflare](https://github.com/user-attachments/assets/a7ac3109-f151-45ac-90ea-49e947157c81)

A modern web application template built with Astro 5, Tailwind CSS 4, Cloudflare Pages, and Cloudflare D1 database integration.

![Astro](https://img.shields.io/badge/Astro-5.x-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Features

- **Full-stack Astro Website**: Built with Astro 5.x for blazing-fast performance
- **Modern UI**: Using Tailwind CSS 4 for styling
- **Cloudflare Integration**: Deployed on Cloudflare Pages with server-side rendering
- **Database Support**: Uses Cloudflare D1 (SQLite) for data storage
- **Authentication**: Simple authentication system included
- **CRUD Operations**: Complete Create, Read, Update, Delete operations example
- **API Testing**: Built-in endpoints for testing database connectivity

## 📁 Project Structure

```
./
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   ├── items.ts
│   │   │   └── test-items.ts
│   │   ├── index.astro
│   │   ├── items.astro
│   │   └── login.astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       └── auth.ts
├── astro.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── wrangler.toml
```

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account (for D1 and Pages deployment)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/loftwah/cloudflare-template.git
   cd cloudflare-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Visit [http://localhost:4321](http://localhost:4321) in your browser.

### Testing with D1 Database Locally

1. Build the project:

   ```bash
   npm run build
   ```

2. Run the preview with D1 enabled:

   ```bash
   npm run preview -- --d1=DB
   ```

3. Visit [http://localhost:8788](http://localhost:8788) to test the application with D1.

## 🔑 Authentication

This template includes a simple authentication system:

- Default password: `password123`
- You can modify this in `src/utils/auth.ts`
- Authentication can be passed via:
  - Query parameter: `?auth=password123`
  - Authorization header: `Bearer password123`

## 📊 Database Structure

The template uses a simple "items" table in D1:

```sql
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT
);
```

## 🚀 Deployment to Cloudflare

### Setup D1 Database

1. Create a D1 database in Cloudflare Dashboard:

   - Go to Workers & Pages > D1
   - Create a new database
   - Note the database ID

2. Update `wrangler.toml` with your database ID.

### Deploy to Cloudflare Pages

1. Push your code to GitHub.

2. In Cloudflare Dashboard:
   - Go to Workers & Pages > Create application
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Add D1 binding:
     - Variable name: `DB`
     - Select your D1 database

## 📝 API Endpoints

- `GET /api`: Test database connection
- `GET /api/items`: Get all items (requires auth)
- `POST /api/items`: Create a new item (requires auth)
- `PUT /api/items`: Update an item (requires auth)
- `DELETE /api/items?id=1`: Delete an item (requires auth)
- `GET /api/test-items`: Run CRUD tests (requires auth)

## 🛠️ Commands

| Command                      | Description                      |
| ---------------------------- | -------------------------------- |
| `npm run dev`                | Start development server         |
| `npm run build`              | Build for production             |
| `npm run preview`            | Preview production build locally |
| `npm run preview -- --d1=DB` | Preview with D1 database enabled |

## 📄 License

MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Loftwah** - [GitHub](https://github.com/loftwah)

## 🙏 Acknowledgments

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudflare](https://cloudflare.com)
