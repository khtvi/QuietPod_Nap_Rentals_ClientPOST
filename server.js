// const express = require('express');
// const app = express();
// const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello API! Your server is running');
// });

// app.get('/profile', (req, res) => {
//     res.json({
//         name: "Khate Israel",
//         course: "BS Computer Science",
//         year: "4th Year",
//         school: "Sacred Heart College"
//     });
// });

// app.get('/skills', (req, res) => {
//     res.json({
//         skills: ["HTML", "CSS", "Javascript", "Flutter"]
//     });
// });

// app.get('/store-info', (req, res) => {
//     res.json({
//         store: "Aling Nena's Sari Sari Store",
//         isOpen: true,
//         hours: {
//             open: "6:00 AM",
//             close: "9:00 PM"
//         },
//         popularItems: [
//             "Skyflakes",
//             "CS Green Tea",
//             "Instant Pancit Canton"
//         ],
//         contactNumber: "0917-123-4567"
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`)
// });

const express = require('express');
const app = express();
const PORT = 3000;

// Reads incoming JSON bodies and makes them available at req.body.
// Without this, req.body is undefined on any POST route.
app.use(express.json());

// Serve client.html (and any other static files) from this folder.
app.use(express.static(__dirname));

// Allow fetch() from any origin (including file:// when opening client.html directly).
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('QuietPod Nap Rentals API is running.');
});

app.get('/business-info', (req, res) => {
  res.json({
    name: "QuietPod Nap Rentals",
    tagline: "A quiet place to rest, whenever you need it",
    locations: 3,
    hours: {
      open: "7:00 AM",
      close: "10:00 PM"
    },
    contact: "0917-123-4567"
  });
});

const pods = [
  { id: 1, location: "Main Library - 2nd Floor", status: "available", category: "Basic", hourlyRate: 5 },
  { id: 2, location: "Main Library - 2nd Floor", status: "occupied", category: "Basic", hourlyRate: 5 },
  { id: 3, location: "Student Union", status: "available", category: "Premium", hourlyRate: 6 },
  { id: 4, location: "Downtown Coworking Hub", status: "available", category: "Premium", hourlyRate: 7 }
];

app.get('/pods', (req, res) => {
  const { status, category } = req.query;
  let filtered = pods;

  if (status) {
    filtered = filtered.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  res.json(filtered);
});

app.get('/pods/:id', (req, res) => {
  const pod = pods.find(p => p.id === parseInt(req.params.id));
  if (!pod) {
    return res.status(404).json({ error: "Pod not found" });
  }
  res.json(pod);
});

// Creates a new pod. Expects { location, category, hourlyRate } in the
// request body. New pods always start out "available" since nobody has
// booked them yet.
app.post('/pods', (req, res) => {
  const { location, category, hourlyRate } = req.body || {};

  if (!location || !category || hourlyRate === undefined || hourlyRate === null || hourlyRate === '') {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newPod = {
    id: pods.length + 1,
    location: String(location).trim(),
    category: String(category).trim(),
    status: "available",
    hourlyRate: Number(hourlyRate)
  };
  pods.push(newPod);
  res.status(201).json(newPod);
});

// Menu routes for direct compatibility with Week 8 handout specification
const menuItems = [
  { id: 1, name: "30-Min Power Nap Pass", category: "Standard", price: 5 },
  { id: 2, name: "60-Min Deep Rest Pass", category: "Standard", price: 10 },
  { id: 3, name: "All-Day Study & Nap Pass", category: "Premium", price: 25 }
];

app.get('/menu', (req, res) => {
  res.json(menuItems);
});

app.post('/menu', (req, res) => {
  const { name, category, price } = req.body || {};

  if (!name || !category || price === undefined || price === null || price === '') {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newItem = {
    id: menuItems.length + 1,
    name: String(name).trim(),
    category: String(category).trim(),
    price: Number(price)
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.get('/amenities', (req, res) => {
  res.json([
    "Active noise-canceling walls",
    "Adjustable memory foam bed",
    "Soft wake-up alarm light",
    "USB charging port",
    "Fresh linen every use"
  ]);
});

app.get('/pricing', (req, res) => {
  res.json({
    hourly: {
      rate: 5,
      minMinutes: 30
    },
    dailyPass: {
      rate: 20,
      maxHours: 6
    },
    membership: {
      monthly: {
        price: 40,
        includedHours: 10
      },
      semester: {
        price: 150,
        includedHours: 45
      }
    }
  });
});

app.get('/availability', (req, res) => {
  res.json({
    "Main Library - 2nd Floor": {
      totalPods: 2,
      available: 1
    },
    "Student Union": {
      totalPods: 1,
      available: 1
    },
    "Downtown Coworking Hub": {
      totalPods: 1,
      available: 1
    }
  });
});

// Customer feedback log — a different shape of data on purpose: each
// entry gets a server-generated timestamp instead of one sent by the client.
const feedbackList = [
  {
    id: 1,
    customerName: "Ana Santos",
    comment: "Best nap of my week! The active noise-canceling was super peaceful.",
    rating: 5,
    submittedAt: new Date(Date.now() - 3600000).toLocaleString()
  }
];

app.post('/feedback', (req, res) => {
  const { customerName, comment, rating } = req.body || {};

  if (!customerName || !comment || rating === undefined || rating === null || rating === '') {
    return res.status(400).json({ error: "Missing fields" });
  }

  const entry = {
    id: feedbackList.length + 1,
    customerName: String(customerName).trim(),
    comment: String(comment).trim(),
    rating: Number(rating),
    submittedAt: new Date().toLocaleString()
  };
  feedbackList.push(entry);
  res.status(201).json(entry);
});

app.get('/feedback', (req, res) => {
  res.json(feedbackList);
});

app.listen(PORT, () => {
  console.log(`QuietPod API running at http://localhost:${PORT}`);
});