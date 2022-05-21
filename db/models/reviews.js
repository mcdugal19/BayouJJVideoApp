const client = require("../client");

// SQL query to add entry to reviews table
async function createReview({ productId, userId, title, post, rating }) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
        INSERT INTO reviews ("productId", "userId", title, post, rating)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [productId, userId, title, post, rating]
    );
    return review;
  } catch (error) {
    console.error("Problem creating review...", error);
  }
}

// SQL query to remove review from object
async function deleteReview(id) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
            DELETE FROM reviews
            WHERE id=$1
            RETURNING *;
        `,
      [id]
    );
    return review;
  } catch (error) {
    console.error("Problem deleting review...", error);
  }
}

// SQL query to delete a user's reviews, used when deleting a user from the database
async function deleteReviewsByUserId(userId) {
  try {
    const { rows } = await client.query(
      `
        DELETE FROM reviews
        WHERE "userId"=$1
        RETURNING *;
      `,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error("Problem deleting reviews by user ID...", error);
  }
}

// SQL query to check if a user has already left a review on specific product, reviews are limited to one review on a product per user
async function userReviewExists(userId, productId) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM reviews
        WHERE "userId"=$1
        AND "productId"=$2;
    `,
      [userId, productId]
    );

    return rows.length > 0;
  } catch (error) {
    console.error("Problem checking reviews by user on product...", error);
  }
}

// SQL query to get review object to check against provided information for API requests
async function getReviewById(id) {
  try {
    const {
      rows: [review],
    } = await client.query(
      `
      SELECT * FROM reviews
      WHERE id=$1;
    `,
      [id]
    );
    return review;
  } catch (error) {
    console.error("Problem getting review by ID...", error);
  }
}

// SQL query to delete reviews for a product, used when deleting a product from database
async function deleteReviewsByProductId(productId) {
  try {
    const { rows } = await client.query(
      `
        DELETE FROM reviews
        WHERE "productId"=$1
        RETURNING *;
      `,
      [productId]
    );
    if (rows) {
      return rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Problem deleting reviews for product...", error);
  }
}

module.exports = {
  createReview,
  deleteReview,
  deleteReviewsByUserId,
  userReviewExists,
  getReviewById,
  deleteReviewsByProductId,
};
