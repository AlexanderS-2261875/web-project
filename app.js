import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { InitializeDatabase } from "./db.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 8080; // Set by Docker Entrypoint or use 8080

// set the view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public', 'views'));
// process.env.DEPLOYMENT is set by Docker Entrypoint
if (!process.env.DEPLOYMENT) {
  console.info("Development mode");
  // Serve static files from the "public" directory
  app.use(express.static("public"));
}

// Middleware for debug logging
app.use((request, response, next) => {
  console.log(
    `Request URL: ${request.url} @ ${new Date().toLocaleString("nl-BE")}`
  );
  next();
});
app.get( "/", (req, res) => {

  // Example data for expenses; replace this with a real database query in practice
  const expenses = [
    { date: '2024-10-01', description: 'Groceries', amount: 50.0 },
    { date: '2024-10-02', description: 'Electricity Bill', amount: 100.0 },
    { date: '2024-10-03', description: 'New Shoes', amount: 80.0 },
    { date: '2024-10-04', description: 'Dining Out', amount: 30.0 },
    { date: '2024-10-05', description: 'Gas', amount: 60.0 },
    { date: '2024-10-06', description: 'Netflix', amount: 20.0 },
    { date: '2024-10-07', description: 'Gym Membership', amount: 45.0 },
    { date: '2024-10-08', description: 'School Supplies', amount: 25.0 },
    { date: '2024-10-09', description: 'Car Maintenance', amount: 150.0 },
    { date: '2024-10-10', description: 'Insurance Payment', amount: 200.0 },
  ];

  res.render("index", { expenses:expenses, title:"HouseBook" });
});

// Middleware for unknown routes
// Must be last in pipeline
app.use((request, response, next) => {
  response.status(404).send("Sorry can't find that!");
});

// Middleware for error handling
app.use((error, request, response, next) => {
  console.error(error.stack);
  response.status(500).send("Something broke!");
});

// App starts here
// InitializeDatabase();
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
