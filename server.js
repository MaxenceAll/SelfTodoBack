// si pas de !port connu = 8000
const PORT = process.env.PORT ?? 8000;
// Import express
const express = require("express");
// Tout express dans app
const app = express();
// import de la connexion à la db
const db = require("./services/database.connexion");
// import de cors pour le crossorigin
const cors = require("cors");
app.use(cors());
//pour recevoir des json il faut ca :)
app.use(express.json());

//import des requetes
const { query } = require("./services/database.service");

// get all todos method:
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const todos = await query("SELECT * FROM todos WHERE user_email = ?", [
      userEmail,
    ]);
    res.json(todos);
  } catch (error) {
    console.error(error);
  }
});

// add a todo
app.post("/todos/", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  try {
    const newTodo = await query(
      "INSERT INTO todos(user_email, title, progress, date) VALUE(? , ? , ? , ?)",
      [user_email, title, progress, date]
    );
    res.json(newTodo);
  } catch (error) {
    console.error(error);
  }
});

//eDIT A TODO
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const modifiedTodo = await query(
      "UPDATE todos SET user_email = ?, title = ? , progress = ?, date= ? WHERE id = ?",
      [user_email, title, progress, date, id]
    );
    res.json(modifiedTodo);
  } catch (error) {
    console.error(error);
  }
});

// delete a todo by id
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params
  try {
    await query(
      'DELETE FROM todos WHERE id = ?',
      [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
