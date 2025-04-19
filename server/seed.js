const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./db");

const seed = async () => {
  await client.connect();

  await createTables();
  console.log("tables created");

  const [john, joe, jane, hammer, drill, nail] = await Promise.all([
    createUser("john", "password1"),
    createUser("joe", "pass123"),
    createUser("jane", "password2"),
    createProduct("hammer"),
    createProduct("drill"),
    createProduct("nail"),
  ]);

  console.log("users created");
  console.log(await fetchUsers());

  console.log("products created");
  console.log(await fetchProducts());

  const [favorite_product] = await Promise.all([
    createFavorite(john.id, hammer.id),
    createFavorite(jane.id, nail.id),
    createFavorite(joe.id, drill.id),
    createFavorite(joe.id, hammer.id)
  ]);

  console.log("favorites created");
  console.log(await fetchFavorites(joe.id));

  await destroyFavorite(favorite_product.id, john.id);

  console.log("after deleting favorite product");
  console.log(await fetchFavorites(joe.id));

  await client.end();
};

seed();
