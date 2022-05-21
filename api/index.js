const apiRouter = require("express").Router();

// Enables stripe
const stripe = require("stripe")(process.env.SECRET_KEY);

// Routes /api/users to the specific user route.
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// Routes /api/products to the specific product route.
// const productsRouter = require("./products");
// apiRouter.use("/products", productsRouter);

// Routes /api/videos to the specific video route.
const videosRouter = require("./videos");
apiRouter.use("/videos", videosRouter);

// Routes /api/cart to the specific cart route.
// const cartRouter = require("./cart");
// apiRouter.use("/cart", cartRouter);

// Routes /api/orders to the specific order route.
// const ordersRouter = require("./orders");
// apiRouter.use("/orders", ordersRouter);

// Routes /api/reviews to the specific review route.
const reviewsRouter = require("./reviews");
apiRouter.use("/reviews", reviewsRouter);

// Route that will generate a unique stripe checkout session. Also will handle moving the user after successful/unsuccessful checkout.
// apiRouter.post("/create-checkout-session", async (req, res, next) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: req.body.items.map((item) => {
//         item.price = Math.round((+item.price.slice(1) + Number.EPSILON) * 100);
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.name,
//             },
//             unit_amount: item.price,
//           },
//           quantity: item.quantity,
//         };
//       }),
//       success_url: `${process.env.SERVER_URL}/success`,
//       cancel_url: `${process.env.SERVER_URL}/cart`,
//     });
//     res.send({ url: session.url });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = apiRouter;
