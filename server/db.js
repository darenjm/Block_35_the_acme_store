const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_store_db"
);

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
    );
    `;

  await client.query(SQL);
};

const createUser = async (name, password) => {
  const SQL = `INSERT INTO users(id, name, password) VALUES($1, $2, $3) RETURNING *;`;
  const hashed_password = await bcrypt.hash(password, 5);

  const response = await client.query(SQL, [uuid.v4(), name, hashed_password]);

  return response.rows[0];
};

const createProduct = async (name) => {
  const SQL = `INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;`;
  const response = await client.query(SQL, [uuid.v4(), name]);

  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `SELECT * from users;`;

  const response = await client.query(SQL);

  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `SELECT * from products`;

  const response = await client.query(SQL);

  return response.rows;
};

const createFavorite = async (user_id, product_id) => {
  const SQL = `INSERT INTO favorites(id, product_id, user_id) VALUES($1, $2, $3) RETURNING *;`;

  const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);

  return response.rows[0];
};

const fetchFavorites = async (user_id) => {
  const SQL = `SELECT * from favorites WHERE user_id = $1;`;

  const response = await client.query(SQL, [user_id]);

  return response.rows;
};

const destroyFavorite = async (id, user_id) => {
  const SQL = `DELETE FROM favorites WHERE id = $1 AND user_id = $2;`;

  await client.query(SQL, [id, user_id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};
