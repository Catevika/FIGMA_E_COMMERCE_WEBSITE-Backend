# 3legant E-Commerce - Backend

The REST API for the 3legant e-commerce application. It is built with Node.js, Express, and MongoDB using Mongoose, and provides account management and cookie-based authentication for the [frontend](https://github.com/Catevika/FIGMA_E_COMMERCE_WEBSITE-Client).

## Features

- User registration and sign-in
- JWT access and refresh-token handling
- HTTP-only refresh-token cookie support
- User listing, profile lookup, profile updates, and account deletion
- CORS configuration for the frontend
- MongoDB persistence through Mongoose

## Tech stack

- Node.js with ES modules
- Express 5
- MongoDB and Mongoose
- JSON Web Tokens and bcrypt

## Getting started

### Requirements

- Node.js and npm
- A MongoDB connection string (local MongoDB or MongoDB Atlas)

### Install and configure

From this directory:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead. Set the values in `.env` before starting the server:

| Variable            | Description                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `MONGO_URI`         | MongoDB connection string                                                                                              |
| `ACCESS_TOKEN_KEY`  | Secret used to sign access tokens                                                                                      |
| `REFRESH_TOKEN_KEY` | Secret used to sign refresh tokens                                                                                     |
| `EXPRESS_PORT`      | HTTP port (defaults to `5000`)                                                                                         |
| `NODE_ENV`          | Runtime environment, such as `development` or `production`                                                             |
| `CLIENT_URL`        | Frontend origin(s), comma-separated if needed (for example, `http://192.168.1.20:5173,https://your-store.example.com`) |

Use strong, private values for both token keys. Do not commit `.env`.
The backend allows HTTP/HTTPS requests from loopback development hosts (`localhost`, `127.0.0.1`, and `::1`) on any port, which supports Vite choosing another port when its default is busy. Configure `CLIENT_URL` with the exact origin for a deployed frontend or a frontend opened from another device on your network. Origins are normalized, so a trailing slash is fine.

### Run the server

```bash
npm run server
```

This starts the API with Node's watch mode. The server listens on `http://localhost:5000` by default. Check `http://localhost:5000/health` for a health response.

For the complete local application, start the frontend in a second terminal with `npm run dev` from the Client directory. Its Vite configuration forwards `/api` requests to this server.

For Vercel, add `MONGO_URI`, `ACCESS_TOKEN_KEY`, and `REFRESH_TOKEN_KEY` under the backend project's **Settings → Environment Variables**, then redeploy. CORS preflight and `/health` requests do not require a database connection; API routes connect to MongoDB on demand and return `503` if the database is unavailable.

## Available scripts

| Command          | Description                               |
| ---------------- | ----------------------------------------- |
| `npm start`      | Start the API server                      |
| `npm run server` | Start the API server with Node watch mode |
| `npm run client` | Start the frontend development server     |
| `npm run dev`    | Start the API and frontend concurrently   |

## API endpoints

Routes are mounted at both the root path and under `/api`. The frontend uses the `/api` prefix.

| Method   | Endpoint               | Description                                            |
| -------- | ---------------------- | ------------------------------------------------------ |
| `GET`    | `/health`              | Health check                                           |
| `GET`    | `/`                    | API service status                                     |
| `POST`   | `/api/signup`          | Register a user                                        |
| `POST`   | `/api/signin`          | Sign in                                                |
| `GET`    | `/api/refresh`         | Refresh an access token using the refresh-token cookie |
| `GET`    | `/api/logout`          | Log out and clear the refresh-token cookie             |
| `GET`    | `/api/users`           | List users                                             |
| `GET`    | `/api/users/:username` | Get user details                                       |
| `PUT`    | `/api/users/:username` | Update a user                                          |
| `DELETE` | `/api/users/:username` | Delete a user                                          |

## Related project

See the [frontend README](https://github.com/Catevika/FIGMA_E_COMMERCE_WEBSITE-Client) for storefront features, pages, and frontend development commands.
