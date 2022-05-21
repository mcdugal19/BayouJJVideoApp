const client = require("../client");

// SQL query to add a product to products table
async function createProduct({
  name,
  variation,
  game,
  image,
  description,
  price,
  inventory,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
            INSERT INTO products (name, variation, game, image, description, price, inventory)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `,
      [name, variation, game, image, description, price, inventory]
    );
    // add default properties for easy of use on frontend
    product.overallRating = null;
    product.reviews = [];
    return product;
  } catch (error) {
    console.error("Problem creating product entry...", error);
  }
}

// This function maps over the rows of the next function to produce optimized product objects with associated reviews attached to the product
function mapOverProducts(rows) {
  let products = {};

  for (let row of rows) {
    if (!products[row.id]) {
      products[row.id] = {
        id: row.id,
        name: row.name,
        variation: row.variation,
        game: row.game,
        image: row.image,
        description: row.description,
        price: row.price,
        inventory: row.inventory,
        overallRating: row.overallRating
          ? +row.overallRating
          : row.overallRating,
        reviews: [],
      };
      if (row.reviewId) {
        products[row.id].reviews.push({
          id: row.reviewId,
          author: {
            userId: row.authorId,
            username: row.authorName,
          },
          title: row.title,
          post: row.post,
          rating: row.rating,
        });
      }
    } else {
      products[row.id].reviews.push({
        id: row.reviewId,
        author: {
          userId: row.authorId,
          username: row.authorName,
        },
        title: row.title,
        post: row.post,
        rating: row.rating,
      });
    }
  }
  return Object.values(products);
}

// SQL query to return all products with attached overallRating and array of review objects with relevent information
async function getAllProductsWithReviews() {
  try {
    const { rows } = await client.query(`
      SELECT products.*,
        (SELECT AVG(reviews.rating)
          FROM reviews
          WHERE "productId"=products.id) AS "overallRating",
        reviews.id AS "reviewId",
        users.id AS "authorId",
        users.username AS "authorName",
        reviews.title,
        reviews.post,
        reviews.rating
      FROM products
      LEFT JOIN reviews
      ON products.id=reviews."productId"
      LEFT JOIN users
      ON reviews."userId"=users.id
      ORDER BY products.id
    `);

    // refine the returned SQL query results with previous mapping function to produce optimized product objects
    return mapOverProducts(rows);
  } catch (error) {
    console.error("Problem getting products with reviews...", error);
  }
}

// original getAllProducts function that was already in use. Became a shell for holding getAllProductsWithReviews to return optimized product objects
async function getAllProducts() {
  try {
    return await getAllProductsWithReviews();
  } catch (error) {
    console.error("Problem getting products...", error);
  }
}

// SQL query to get a specific row from products table
async function getProductById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      SELECT * FROM products
      WHERE id=$1;
    `,
      [id]
    );
    return product;
  } catch (error) {
    console.error("Problem getting product by id...", error);
  }
}

// SQL update request to be used by an admin to update product information
async function updateProduct(fields = {}) {
  const { id } = fields;
  delete fields.id;

  // build update string for SQL query
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [product],
    } = await client.query(
      `
        UPDATE products
        SET ${setString}
        WHERE id=$1
        RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    return product;
  } catch (error) {
    console.error("Problem updating product...", error);
  }
}

// require delete functions for dependent tables before deleting product in below function
const { deleteReviewsByProductId } = require("./reviews");
const { clearProductFromAllCarts } = require("./cart");

// SQL queries to delete dependent table entries before deleting product
async function deleteProduct(id) {
  try {
    const reviews = await deleteReviewsByProductId(id);
    const cart = await clearProductFromAllCarts(id);
    const {
      rows: [product],
    } = await client.query(
      `
      DELETE FROM products
      WHERE id=$1
      RETURNING *;
    `,
      [id]
    );
    // returns an object with pertinent information to be used on the frontend
    product.reviews = reviews;
    const deleted = {
      id: product.id,
      product,
      message: "Successfully deleted product!",
    };
    return deleted;
  } catch (error) {
    console.error("Problem deleting product...", error);
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsWithReviews,
};