# Calne Backend

The backend service for **Calne**, a car marketplace platform. It provides the REST API used by the Calne React frontend, an EJS-based dealer and administrator portal, MongoDB persistence, image uploads, cookie-based authentication, and real-time messaging through Socket.IO.

## Features

- Member registration, login, logout, and profile management
- JWT authentication for REST API clients
- Session authentication for dealer and administrator pages
- Dealer discovery and dealer profile pages
- Vehicle catalog, filtering, details, likes, and view tracking
- Dealer-managed vehicle creation and updates
- Shopping orders with status tracking
- Community articles, comments, events, and image uploads
- Member follow and unfollow functionality
- Admin tools for dealer moderation and event management
- Real-time online-user counts and chat messages with Socket.IO
- Local image storage with Multer and UUID filenames

## Tech Stack

- **Runtime:** Node.js
- **Web framework:** Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens, cookies, and Express sessions
- **Password hashing:** bcryptjs
- **Server-side rendering:** EJS
- **File uploads:** Multer
- **Real-time communication:** Socket.IO
- **Process management:** PM2
- **Development:** Nodemon
- **Containerization:** Docker Compose

## Architecture

The application exposes two interfaces from the same Express server:

1. **REST API** ??mounted at `/` and consumed by the Calne React frontend. Authentication is handled by an `access_token` JWT cookie.
2. **Dealer/Admin portal** ??mounted at `/dealers` and rendered with EJS. Authentication is stored in a MongoDB-backed server session.

```text
React client ??????? REST API ?????????                                     ??Dealer/Admin browser ?? EJS routes ???쇄?? Express ?? Mongoose ?? MongoDB
                                     ??Socket.IO client ??? WebSocket ????????```

## Prerequisites

- [Node.js](https://nodejs.org/) 16 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dragonmm98/carsale-backend.git
cd carsale-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3013
MONGO_URL=mongodb://127.0.0.1:27017/calne
SESSION_SECRET=replace-with-a-long-random-session-secret
SECRET_TOKEN=replace-with-a-long-random-jwt-secret
```

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP and Socket.IO port; defaults to `3013` |
| `MONGO_URL` | Yes | MongoDB connection URI used by Mongoose and the session store |
| `SESSION_SECRET` | Yes | Secret used to sign dealer/admin session cookies |
| `SECRET_TOKEN` | Yes | Secret used to sign and verify member JWTs |

Generate secrets with Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit the `.env` file or production credentials.

### 4. Prepare upload directories

Uploaded files are written to the following local directories. Create them if they do not already exist:

```text
uploads/
?쒋?? community/
?쒋?? members/
?붴?? products/
```

Uploaded files are publicly served from `/uploads`.

### 5. Start the server

For development with automatic restarts:

```bash
npm run dev
```

For a normal start:

```bash
npm start
```

The server is available at [http://localhost:3013](http://localhost:3013) unless `PORT` is changed. The dealer portal starts at [http://localhost:3013/dealers](http://localhost:3013/dealers).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the server with Node.js |
| `npm run dev` | Starts the server with Nodemon |
| `npm run train` | Runs `train.js` with Nodemon |
| `npm run start:prod` | Runs the current production-start script |
| `npm test` | Placeholder; automated tests are not configured yet |

## Authentication

### REST API authentication

Successful signup or login creates an `access_token` cookie containing a JWT. The token expires after six hours. Browser clients must include credentials in cross-origin requests.

Axios example:

```js
const api = axios.create({
  baseURL: "http://localhost:3013",
  withCredentials: true,
});
```

The authentication middleware makes the decoded member available as `req.member`. Some read endpoints accept anonymous requests, while write operations validate that a member is authenticated.

### Dealer and administrator authentication

The EJS portal uses `express-session`, with sessions stored in MongoDB for 30 minutes. Access is role-based:

- `DEALER` members can manage their own products.
- `ADMIN` members can manage dealers and events.

## REST API Reference

The API commonly returns one of these response shapes:

```json
{
  "state": "succeed",
  "data": {}
}
```

```json
{
  "state": "fail",
  "message": "Error description"
}
```

Some handlers use `success` instead of `succeed`. Clients should check the `state` value returned by each endpoint.

### Members

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/signup` | Public | Register a member and set the JWT cookie |
| `POST` | `/login` | Public | Authenticate a member and set the JWT cookie |
| `GET` | `/logout` | Public | Clear the JWT cookie |
| `GET` | `/check-me` | JWT cookie | Return the decoded authenticated member |
| `GET` | `/member/:id` | Optional | Get a member profile and record an authenticated view |
| `POST` | `/member-liken` | Required | Toggle a like on a supported target |
| `POST` | `/member/update` | Required | Update the current member profile and optional image |

Signup request:

```json
{
  "mb_nick": "alex",
  "mb_phone": "+82-10-1234-5678",
  "mb_password": "strong-password"
}
```

Login request:

```json
{
  "mb_nick": "alex",
  "mb_password": "strong-password"
}
```

Profile updates use `multipart/form-data`. Supported fields include `mb_nick`, `mb_phone`, `mb_address`, `mb_description`, and the `mb_image` file.

### Products

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/products` | Optional | Return a paginated, sorted vehicle list |
| `POST` | `/filter` | Optional | Filter vehicles by size and dealer |
| `GET` | `/products/:id` | Optional | Return one vehicle and record an authenticated view |

Product list request:

```json
{
  "page": 1,
  "limit": 12,
  "order": "createdAt",
  "dealers_mb_id": "optional-dealer-object-id",
  "product_size": "SPORT"
}
```

Supported product values include:

- Collection: `NEW`, `USED`
- Status: `RESERVED`, `PROCESS`, `SOLD`, `DELETED`
- Size: `ORDINARY`, `SPORT`, `MINI`, `VAN`, `TRUCK`
- Fuel: `GASOLINE`, `DIESEL`, `GAS`, `ELECTRIC`, `HYBRID`

Only products with `PROCESS` status are returned by the public catalog endpoints.

### Dealers

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/dealer` | Optional | List active dealers with pagination and sorting |
| `GET` | `/dealer/:id` | Optional | Return an active dealer profile |

Example query:

```text
GET /dealer?page=1&limit=10&order=mb_views
```

`order` also supports the special values `top` and `random`.

### Orders

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/orders/create` | Required | Create an order and its order items |
| `GET` | `/orders` | Required | Get the current member's orders by status |
| `POST` | `/orders/edit` | Required | Change an order status |

Create-order request:

```json
[
  {
    "_id": "product-object-id",
    "quantity": 1,
    "price": 35000
  }
]
```

List orders with `GET /orders?status=paused`. Supported statuses are `PAUSED`, `PROCESS`, `FINISHED`, and `DELETED`.

Update request:

```json
{
  "order_id": "order-object-id",
  "order_status": "PROCESS"
}
```

### Community

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/community/image` | Public | Upload an article image as `community_image` |
| `POST` | `/community/create` | Required | Create a community article |
| `GET` | `/community/articles` | Optional | Get articles written by a member |
| `GET` | `/community/target` | Optional | Get paginated articles by board |
| `GET` | `/community/single-article/:art_id` | Optional | Get one article |
| `GET` | `/community/events` | Optional | Get active events |
| `GET` | `/community/comments` | Optional | Get paginated comments |
| `POST` | `/comment/create` | Required | Create a comment |

Supported community boards are `dealerfeed`, `aboutcars`, and `recommendation`.

Article list example:

```text
GET /community/target?bo_id=all&page=1&limit=10&order=createdAt
```

### Follows

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/follow/subscribe` | Required | Follow another member |
| `POST` | `/follow/unsubscribe` | Required | Unfollow another member |
| `GET` | `/follow/followings` | Public | Get a member's following list |
| `GET` | `/follow/followers` | Optional | Get a member's follower list |

Follow and unfollow request:

```json
{
  "mb_id": "target-member-object-id"
}
```

Pagination example:

```text
GET /follow/followers?mb_id=member-object-id&page=1&limit=10
```

## Dealer and Admin Portal Routes

All portal routes use the `/dealers` prefix.

| Method | Route | Role | Description |
| --- | --- | --- | --- |
| `GET` | `/dealers` | Public | Portal home page |
| `GET`, `POST` | `/dealers/signup` | Public | Dealer registration form and submission |
| `GET`, `POST` | `/dealers/login` | Public | Dealer/admin login form and submission |
| `GET` | `/dealers/logout` | Signed in | Destroy the portal session |
| `GET` | `/dealers/check-me` | Optional | Check the current session |
| `GET` | `/dealers/products/menu` | Dealer session | Render the dealer's product menu |
| `POST` | `/dealers/products/create` | `DEALER` | Create a vehicle with up to five images |
| `POST` | `/dealers/products/edit/:id` | `DEALER` | Update a vehicle owned by the dealer |
| `GET` | `/dealers/all-dealers` | `ADMIN` | Render dealer and event administration |
| `POST` | `/dealers/all-dealers/update` | `ADMIN` | Update a dealer account |
| `POST` | `/dealers/event/create` | `ADMIN` | Create an event with an image |
| `POST` | `/dealers/event/edit/:id` | `ADMIN` | Update an event |

Vehicle creation uses `multipart/form-data` and accepts up to five files in the `product_images` field.

## Socket.IO Events

Socket.IO is served from the same host and port as Express.

| Direction | Event | Payload | Description |
| --- | --- | --- | --- |
| Server ??client | `greetMsg` | `{ "text": "welcome" }` | Sent when a client connects |
| Server ??clients | `infoMsg` | `{ "total": number }` | Broadcasts the online-user count |
| Client ??server | `createMsg` | Any message object | Submits a chat message |
| Server ??clients | `newMsg` | Submitted message | Broadcasts a chat message to all clients |

## Data Model Overview

- **Member** ??identity, role, status, profile, engagement counters, and credentials
- **Product** ??vehicle details, pricing, images, status, and owning dealer
- **Order** ??customer, totals, delivery cost, and lifecycle status
- **OrderItem** ??product, quantity, price, and parent order
- **BoArticle** ??community board article and engagement counts
- **Comment** ??member-authored comments
- **Follow** ??follower/followed-member relationship
- **Like** ??member likes for products, members, and community content
- **View** ??unique member views of supported targets
- **Event** ??administrator-managed event content

MongoDB automatically adds timestamps to the primary schemas.

## Project Structure

```text
carsale-backend/
?쒋?? controllers/            # HTTP handlers and authorization middleware
?쒋?? lib/                    # Enums, shared MongoDB helpers, and error messages
?쒋?? models/                 # Business logic and database operations
?쒋?? public/                 # Portal CSS, JavaScript, and static assets
?쒋?? schema/                 # Mongoose schemas
?쒋?? utils/                  # Multer upload configuration
?쒋?? views/                  # EJS templates for dealer/admin pages
?쒋?? app.js                  # Express, sessions, routing, and Socket.IO setup
?쒋?? server.js               # Environment loading and MongoDB/server startup
?쒋?? router.js               # REST API routes
?쒋?? router_bssr.js          # Dealer/admin portal routes
?쒋?? process.config.js       # PM2 configuration
?쒋?? docker-compose.yml      # Node.js service definition
?붴?? deploy.sh               # PM2 deployment script
```

## Running with Docker Compose

The included Compose file runs the application in a Node.js 16 container and exposes port `3013`:

```bash
docker compose up
```

The service expects environment configuration and a reachable MongoDB instance. Supply variables through your environment or extend `docker-compose.yml` with an `env_file` entry. The current Compose file defines the Node.js service only; it does not create a MongoDB container.

## Deployment with PM2

Install PM2 and start the provided process configuration:

```bash
npm install --global pm2
npm install
pm2 start process.config.js --env production
pm2 save
```

The configuration runs one clustered application instance named `Calne` and watches the project directory. For production, consider disabling `watch` and placing the app behind a reverse proxy with HTTPS.

## Production Considerations

Before deploying publicly:

- Restrict CORS to the frontend's trusted origin instead of accepting arbitrary origins.
- Store strong secrets outside the repository.
- Use secure, HTTP-only, and appropriately configured same-site cookies over HTTPS.
- Validate request bodies and uploaded file types and sizes.
- Ensure upload directories use persistent storage and are backed up if needed.
- Add centralized error handling and consistent HTTP status codes.
- Disable verbose logs that may expose authentication details.
- Add rate limiting, security headers, and automated tests.
- Use a managed MongoDB service or a secured, backed-up MongoDB deployment.

## Related Project

- [Calne React frontend](https://github.com/dragonmm98/calne)

Set the frontend's `REACT_APP_API_URL` to this server's public URL.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the ISC License as declared in `package.json`.
