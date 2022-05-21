const client = require("../client");

// require bcrypt for hashing passwords and checking hashed passwords
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// SQL query for use by site administrators
async function getAllUsers() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM users;
    `);
    return rows;
  } catch (error) {
    console.error("Problem getting all users", error);
  }
}

// SQL query to create a new user entry in users table
async function createUser({ username, password, email }) {
  try {
    // hash password before storing in database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password, email)
    VALUES ($1, $2, $3)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `,
      [username, hashedPassword, email]
    );

    // remove password before returning user object to API, add empty cart to facilitate frontend functionality
    delete user.password;
    user.cart = [];
    return user;
  } catch (error) {
    console.error("Problem creating user", error);
  }
}

// original SQL query for getting req.user in API, now used as a shell for getUserWithCart to ensure a user's cart is available on login
async function getUserById(id) {
  try {
    return await getUserWithCart(id);
  } catch (error) {
    console.error("Problem getting user by id", error);
  }
}

// SQL query used to check if username is taken or when comparing login information
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE username = $1;
    `,
      [username]
    );
    return user;
  } catch (error) {
    console.error("Problem getting User by Username", error);
  }
}

// function use for user login
async function getUser({ username, password }) {
  try {
    // get user by username with hashed password, using bcrypt to compare provided password with hashed password
    const user = await getUserByUsername(username);
    if (user) {
      const hashedPassword = user.password;
      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
      // on match, get user using username and hashed password
      if (passwordsMatch) {
        const {
          rows: [user],
        } = await client.query(
          `
                SELECT *
                FROM users
                WHERE username = $1
                AND password = $2;
            `,
          [username, hashedPassword]
        );

        // return optimized user object with attached cart, using the user ID from above SQL query
        return await getUserWithCart(user.id);
      } else {
        throw new Error("Passwords did not match...");
      }
    } else {
      throw new Error("User does not exist...");
    }
  } catch (error) {
    console.error("Problem getting user...", error);
  }
}

// require delete functions for dependent tables before deleting user in below function
const { deleteReviewsByUserId } = require("./reviews");
const { clearUserCart } = require("./cart");

// SQL queries to delete dependent table entries before deleting user
async function deleteUser(id) {
  try {
    const reviews = await deleteReviewsByUserId(id);
    const cart = await clearUserCart(id);
    const {
      rows: [user],
    } = await client.query(
      `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );

    // attach user's reviews to returned object in case information needs to be accessible on frontend
    user.reviews = reviews;
    return user;
  } catch (error) {
    console.error("Problem deleting user", error);
  }
}

// SQL query to update user information
async function updateUser(fields = {}) {
  const { id } = fields;
  delete fields.id;

  // if password is changing, hash password before storage
  if (fields.password) {
    const hashedPassword = await bcrypt.hash(fields.password, SALT_ROUNDS);
    fields.password = hashedPassword;
  }

  // build SQL update string based on provided fields
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 2}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    if (setString.length > 0) {
      const {
        rows: [user],
      } = await client.query(
        `
      UPDATE users
      SET ${setString}
      WHERE id=$1
      RETURNING *;
      `,
        [id, ...Object.values(fields)]
      );
      return user;
    }
  } catch (error) {
    console.error("Problem updating user info", error);
  }
}

// maps over rows from next function to add cart and order information to user object
async function mapOverUserRows(rows, id) {
  let user = {};
  // adding cart property to user object
  for (let row of rows) {
    if (!user.id) {
      user = {
        id: row.id,
        username: row.username,
        email: row.email,
        isAdmin: row.isAdmin,
        cart: [],
      };
      if (row.productId) {
        user.cart.push({
          id: row.productId,
          name: row.name,
          variation: row.variation,
          game: row.game,
          image: row.image,
          description: row.description,
          price: row.price,
          quantity: row.quantity,
        });
      }
    } else {
      user.cart.push({
        id: row.productId,
        name: row.name,
        variation: row.variation,
        game: row.game,
        image: row.image,
        description: row.description,
        price: row.price,
        quantity: row.quantity,
      });
    }
  }

  // get user's order information
  const orderRows = await getUserWithOrders(id);
  user.orders = [];
  // add order information to orders property
  for (let orderRow of orderRows) {
    if (orderRow.productId) {
      user.orders.push({
        id: orderRow.productId,
        name: orderRow.name,
        variation: orderRow.variation,
        game: orderRow.game,
        image: orderRow.image,
        description: orderRow.description,
        price: orderRow.price,
        quantity: orderRow.quantity,
      });
    } else {
      user.orders = [];
    }
  }
  return user;
}

// SQL query to get optimized user object with cart items attached for frontend functionality
async function getUserWithCart(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT users.id,
        users.username,
        users.email,
        users."isAdmin",
        products.id AS "productId",
        products.name,
        products.variation,
        products.game,
        products.image,
        products.description,
        products.price,
        cart.quantity
      FROM users
      LEFT JOIN cart
      ON users.id=cart."userId"
      LEFT JOIN products
      ON cart."productId"=products.id
      WHERE users.id=$1;
    `,
      [id]
    );

    // map over returned rows to add cart to user, and pull in order information
    return await mapOverUserRows(rows, id);
  } catch (error) {
    console.error("Problem getting user with cart...", error);
  }
}

// SQL query used in the above mapping function used to add orders information to user object
async function getUserWithOrders(id) {
  try {
    const { rows } = await client.query(
      `
      SELECT users.id,
        users.username,
        users.email,
        users."isAdmin",
        products.id AS "productId",
        products.name,
        products.variation,
        products.game,
        products.image,
        products.description,
        products.price,
        users_orders.quantity
      FROM users
      LEFT JOIN users_orders
      ON users.id=users_orders."userId"
      LEFT JOIN products
      ON users_orders."productId"=products.id
      WHERE users.id=$1;
    `,
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Problem getting user with cart...", error);
  }
}

// SQL query used to check if a user with a specified email already exists when creating a new user
async function getUserByEmail(email) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE email = $1
    `,
      [email]
    );
    return user;
  } catch (error) {
    console.error("Problem with getting user by email...", error);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  getUser,
  deleteUser,
  getUserByEmail,
};