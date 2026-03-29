# FlowDesk Client

A React frontend for the FlowDesk Task Board — a clean, Linear-inspired project management interface built with Vite, Tailwind CSS, and React Router.

---

## Live URLs

| | URL |
|---|---|
| Frontend | https://flowdesk-client.vercel.app/ |
| Backend API | http://flowdesk-production.eba-umvnisit.ap-south-1.elasticbeanstalk.com/swagger |

---

## Tech Stack

| | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Deployment | Vercel |

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- FlowDesk API running (locally or on AWS)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Priya-Sivalingam/flowdesk-client.git
cd flowdesk-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the API Base URL

Open `src/api/axios.js` and update the `baseURL` to point to your running API:

```js
const api = axios.create({
  baseURL: 'http://localhost:5287/api',   // ← local development
  // baseURL: 'http://flowdesk-production.eba-umvnisit.ap-south-1.elasticbeanstalk.com/api', // ← production
})
```

### 4. Run the App

```bash
npm run dev
```

Open your browser at:
```
http://localhost:5173
```

---

## Pages

| Page | Route | Access |
|---|---|---|
| Login | `/login` | Public |
| Projects | `/` | Logged in users |
| Project Detail (Kanban) | `/projects/:id` | Logged in users |

---

## Features

- Login with Employee ID and password
- JWT token stored in localStorage and attached to every request automatically
- View all projects in a card grid
- Admin can create new projects
- Kanban board per project with four columns — To Do, In Progress, Done, Cancelled
- Filter tasks by status
- Admin can create new tasks with title, description, priority, due date, and assignee
- Move tasks through workflow with one click (Start → Mark Done)
- Cancel tasks from In Progress
- Admin can archive completed or cancelled tasks
- Assignee avatar shown on each task card
- Priority badges with color coding


## Role-Based UI

| Feature | Admin | Member |
|---|---|---|
| View projects | ✅ | ✅ |
| Create project | ✅ | ❌ |
| View kanban board | ✅ | ✅ |
| Create task | ✅ | ❌ |
| Move task status | ✅ | ✅ |
| Archive task | ✅ | ❌ |

