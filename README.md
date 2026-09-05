# QuietPod Nap Rentals API

Ever been so exhausted at school or work that you just needed 20 minutes of actual quiet? That's the problem QuietPod solves. This is a small backend API for a business that rents out noise-canceling nap pods by the hour — think phone-booth-sized rooms with a bed, blackout walls, and a soft alarm to wake you up on time.

This API is what would sit behind a mobile app for the business. It doesn't have a database yet — everything below is realistic placeholder data — but it's built the way a real backend would be: separate, clearly named routes for each piece of information the app would need.

## How to run it

1. Make sure you have Node.js installed.
2. Open a terminal in this folder and run:
   ```
   npm install
   node server.js
   ```
3. You should see: `QuietPod API running at http://localhost:3000`
4. Open your browser and visit any of the routes below.

If you visit `http://localhost:3000/` by itself, you'll just get a welcome message confirming the API is running — that's normal, not an error.

## Routes

| Route | What it does |
|-------|--------------|
| `GET /` | Health check — confirms the API is running |
| `GET /business-info` | Returns company name, tagline, number of locations, hours, and contact number |
| `GET /pods` | Returns every pod with its location, category, current availability status, and hourly rate |
| `GET /pods?category=Basic` | Filters pods by category — use `Basic` or `Premium` |
| `GET /pods?status=available` | Filters pods by status — use `available` or `occupied` |
| `GET /pods/:id` | Returns one specific pod by its ID number; returns 404 if the ID doesn't exist |
| `POST /pods` | Creates a new pod. Expects `location`, `category`, `hourlyRate` in the body; returns 400 if any are missing |
| `GET /menu` | Returns menu items / nap passes list (handout compatibility) |
| `POST /menu` | Adds a new menu item. Expects `name`, `category`, `price` in the body; returns 400 if any are missing |
| `GET /amenities` | Returns a list of everything included inside a pod |
| `GET /pricing` | Returns all pricing options: hourly, daily pass, and monthly/semester memberships |
| `GET /availability` | Returns a per-location count of total pods and how many are currently free |
| `POST /feedback` | Creates a customer feedback entry. Expects `customerName`, `comment`, `rating` in the body; returns 400 if any are missing |
| `GET /feedback` | Returns every feedback entry submitted so far, each with a server-generated timestamp |

## What each route gives you

### `GET /`
A simple health-check message to confirm the server is up.
```
QuietPod Nap Rentals API is running.
```

---

### `GET /business-info`
The basics about the company — name, tagline, how many locations, hours, and contact info. Good for an "About" screen in an app.
```json
{
  "name": "QuietPod Nap Rentals",
  "tagline": "A quiet place to rest, whenever you need it",
  "locations": 3,
  "hours": {
    "open": "7:00 AM",
    "close": "10:00 PM"
  },
  "contact": "0917-123-4567"
}
```

---

### `GET /pods`
Every individual pod the business owns, where it's located, its category (Basic or Premium), whether it's free or occupied right now, and what it costs per hour.
```json
[
  { "id": 1, "location": "Main Library - 2nd Floor", "status": "available", "category": "Basic",   "hourlyRate": 5 },
  { "id": 2, "location": "Main Library - 2nd Floor", "status": "occupied",  "category": "Basic",   "hourlyRate": 5 },
  { "id": 3, "location": "Student Union",             "status": "available", "category": "Premium", "hourlyRate": 6 },
  { "id": 4, "location": "Downtown Coworking Hub",    "status": "available", "category": "Premium", "hourlyRate": 7 }
]
```

---

### `GET /pods?category=Basic`
Filters the pod list by category. Use `Basic` or `Premium` (case-insensitive). You can also combine both filters at once: `/pods?category=Basic&status=available`.

Example: `http://localhost:3000/pods?category=Premium`
```json
[
  { "id": 3, "location": "Student Union",          "status": "available", "category": "Premium", "hourlyRate": 6 },
  { "id": 4, "location": "Downtown Coworking Hub", "status": "available", "category": "Premium", "hourlyRate": 7 }
]
```

---

### `GET /pods?status=available`
Filters pods by status. Works with `available` or `occupied` (case-insensitive). Both `?category=` and `?status=` can be combined.

Example: `http://localhost:3000/pods?status=available`
```json
[
  { "id": 1, "location": "Main Library - 2nd Floor", "status": "available", "category": "Basic",   "hourlyRate": 5 },
  { "id": 3, "location": "Student Union",             "status": "available", "category": "Premium", "hourlyRate": 6 },
  { "id": 4, "location": "Downtown Coworking Hub",    "status": "available", "category": "Premium", "hourlyRate": 7 }
]
```

---

### `GET /pods/:id`
Returns one specific pod by its ID. The `:id` is a route parameter — whatever number the visitor types in place of `:id` is what gets looked up. If no pod with that ID exists, the server responds with a `404` and an error message instead of crashing.

Example: `http://localhost:3000/pods/3`
```json
{ "id": 3, "location": "Student Union", "status": "available", "category": "Premium", "hourlyRate": 6 }
```

If the ID doesn't exist (e.g. `/pods/99`):
```json
{ "error": "Pod not found" }
```

---

### `POST /pods`
Adds a new pod to the list. Send a JSON body with `location`, `category`, and `hourlyRate` — the server assigns the `id` and always sets a brand-new pod's `status` to `"available"`, since nobody has booked it yet.

Request body:
```json
{ "location": "Rooftop Deck", "category": "Premium", "hourlyRate": 8 }
```

Response (`201 Created`):
```json
{ "id": 5, "location": "Rooftop Deck", "category": "Premium", "status": "available", "hourlyRate": 8 }
```

If `location`, `category`, or `hourlyRate` is missing, the server responds with `400 Bad Request` instead of saving a broken pod:
```json
{ "error": "Missing fields" }
```

---

### `GET /menu`
Returns all available menu items / nap passes. Provided for direct compatibility with the Week 8 handout specification.
```json
[
  { "id": 1, "name": "30-Min Power Nap Pass", "category": "Standard", "price": 5 },
  { id: 2, "name": "60-Min Deep Rest Pass", "category": "Standard", "price": 10 },
  { id: 3, "name": "All-Day Study & Nap Pass", "category": "Premium", "price": 25 }
]
```

---

### `POST /menu`
Adds a new item to the menu array. Expects a JSON body with `name`, `category`, and `price`. The server assigns an auto-incrementing `id` and returns the saved item.

Request body:
```json
{ "name": "Overnight Recharge Pass", "category": "Premium", "price": 35 }
```

Response (`201 Created`):
```json
{ "id": 4, "name": "Overnight Recharge Pass", "category": "Premium", "price": 35 }
```

If `name`, `category`, or `price` is missing, the server responds with `400 Bad Request`:
```json
{ "error": "Missing fields" }
```

---

### `GET /amenities`
What you actually get inside a pod when you rent one. Simple list, easy to display as bullet points in an app.
```json
[
  "Active noise-canceling walls",
  "Adjustable memory foam bed",
  "Soft wake-up alarm light",
  "USB charging port",
  "Fresh linen every use"
]
```

---

### `GET /pricing`
All the ways you can pay. Nap pods aren't priced just one way — you can pay by the hour, grab a day pass, or get a membership. Memberships themselves split into monthly or semester options. That's why this data is nested instead of a flat list.
```json
{
  "hourly":    { "rate": 5,   "minMinutes": 30 },
  "dailyPass": { "rate": 20,  "maxHours": 6 },
  "membership": {
    "monthly":  { "price": 40,  "includedHours": 10 },
    "semester": { "price": 150, "includedHours": 45 }
  }
}
```

---

### `GET /availability`
A quick snapshot of how many pods are free at each location right now, without having to scroll through the full `/pods` list.
```json
{
  "Main Library - 2nd Floor": { "totalPods": 2, "available": 1 },
  "Student Union":             { "totalPods": 1, "available": 1 },
  "Downtown Coworking Hub":    { "totalPods": 1, "available": 1 }
}
```

---

### `POST /feedback`
Adds a customer feedback entry. Send a JSON body with `customerName`, `comment`, and `rating` — the server assigns the `id` and stamps `submittedAt` with the current date/time itself, so the client never has to send it.

Request body:
```json
{ "customerName": "Ana", "comment": "Best nap of my week.", "rating": 5 }
```

Response (`201 Created`):
```json
{ "id": 1, "customerName": "Ana", "comment": "Best nap of my week.", "rating": 5, "submittedAt": "9/5/2026, 6:47:06 AM" }
```

If `customerName`, `comment`, or `rating` is missing, the server responds with `400 Bad Request`:
```json
{ "error": "Missing fields" }
```

---

### `GET /feedback`
Returns every feedback entry submitted so far, in the order they were received.
```json
[
  { "id": 1, "customerName": "Ana", "comment": "Best nap of my week.", "rating": 5, "submittedAt": "9/5/2026, 6:47:06 AM" }
]
```

---

## Why it's built this way

Each route only returns one type of thing and has a name that says exactly what it does — no `/data1` or `/page2` guessing games. Three different data shapes are covered on purpose: a flat object (`/business-info`), plain arrays (`/pods`, `/amenities`), and nested objects (`/pricing`, `/availability`) — the same mix of shapes a real mobile app would need to pull from a real backend.

Route parameters (`:id`) and query strings (`?status=`) are also included to show how a real API lets the client ask for exactly what it needs, instead of always sending everything.

## Frontend client

Open `client.html` in a browser **while the server is running** to get a live pod browser. It uses `async/await` and `fetch` to:

- Load all pods automatically when the page opens
- Filter pods by category (All / Basic / Premium) without reloading the page
- Show full details for any pod by clicking on it (fetches from `/pods/:id`)
- Add a new pod through the **Add a New Pod** form — `POST`s to `/pods` and instantly refreshes the pod list, no page reload
- Submit customer feedback through the **Leave Feedback** form — `POST`s to `/feedback`, which is timestamped server-side; visit `http://localhost:3000/feedback` directly to see all saved entries
- Both forms surface the server's `400 Bad Request` response inline if required fields are missing
