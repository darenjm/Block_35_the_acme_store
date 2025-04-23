const express = require("express");
const morgan = require("morgan");
const {
  client,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");

const server = express();
client.connect();

server.use(express.json());
server.use(morgan("dev"));

const port = process.env.PORT || 3400;
server.listen(port, () => console.log(`server listening on port ${port}`));

server.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products", async (req, res, next) => {
  try {
    const users = await fetchProducts();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    const users = await fetchFavorites(req.params.id);
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    const skill = await createUserSkill(req.params.id, req.body.skill_id);
    res.send(skill);
  } catch (error) {
    next(error);
  }
});

server.delete("/api/users/:user_id/favorites/:id", async (req, res, next) => {
  try {
    await destroyUserSkill(req.params.id, req.params.user_id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});