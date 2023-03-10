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
// import bcrypt pour le password
const bcrypt = require("bcrypt");
// import jsonwebtoken
const jwt = require("jsonwebtoken");

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
  const { id } = req.params;
  try {
    await query("DELETE FROM todos WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});

// sign up route
app.post("/signup", async (req, res) => {
  console.log("Sign up route taken");
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    await query(`INSERT INTO users (email, hashed_password) VALUES(?,?)`, [
      email,
      hashedPassword,
    ]);
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.sqlMessage });
    }
  }
});

// login route
app.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    const users = await query(`SELECT * FROM users WHERE email = ?`, [email]);
    console.log(users);
    if (!users[0] || !users){
      return res.json({ detail: 'User does not exists !(TODO not secure)'})
    }else{
      //compare le pass recu avec le hashed pass via bcrypt
      const success = await bcrypt.compare(password, users[0].hashed_password)
      // login ok donc creation d'un token
      const token = jwt.sign( {email} , 'secret' , {expiresIn: '1hr'} );
      if (success) {
        //si compare ok on renvoi un json avec le mail et le token
        res.json( {'email': users[0].email, token} )
      }else{
        res.json( {detail: "Login fail, check email or password"})
      }
    }    
  } catch (error) {
    console.error(error)
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
