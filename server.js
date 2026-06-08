const app = require('./app')

const PORT = 3000

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})