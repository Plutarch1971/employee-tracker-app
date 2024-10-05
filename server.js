const express = require('express');
const { pool, connectToDb } = require('./db/connection')
const api = require('./routes/index');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

app.listen(PORT, async () => {
  await connectToDb();
  console.log(`App listening at http://localhost:${PORT} 🚀`)
});
