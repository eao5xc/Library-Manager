const express = require("express"); // Sets up the express requirement
const app = express(); // Actually creating a new server instance
const fetch = require("isomorphic-fetch"); // Sets up the isomorphic fetch requirement
const path = require("path");

/* Section that gets data form the API */
app.get("/api/books", async (req, res) => {
  // The following is tried to by the server
  try {
    const { title } = req.query; // Gets the title query paramaeter if provided
    if (!title) throw new Error("You must provide a title query parameter"); // If there is no title

    /* Making our request to Google Books */
    const data = await fetch(
      "https://www.googleapis.com/books/v1/volumes?q=" + title
    ).then((res) => res.json()); // Gets all possible books as a json object
    const books = data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors && book.volumeInfo.authors.join(", "),
      description: book.volumeInfo.description,
      rating: book.volumeInfo.averageRating,
      image: book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail,
    })); // Maps the json object to specific values

    res.json(books); // Returns the book json object to the user
  } catch (error) {
    /* Sending an error response if anything went wrong */
    console.log(error); // Logs to conosle
    res.status(500).json({ error }); // Sets the status of the page
  }
});

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

// Listening for requests on a specific port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on port ${port}`));
