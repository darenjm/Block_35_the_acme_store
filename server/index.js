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
