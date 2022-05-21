const express = require("express");
const reviewsRouter = express.Router();
const { Reviews } = require("../db");
const { authRequired } = require("./utils");

// Route that allows a user to add a review to the review database.
reviewsRouter.post("/", authRequired, async (req, res, next) => {
  const { productId, title, post, rating } = req.body;
  if (!title || !post) {
    next({
      name: "RequiredFields",
      message: "Reviews must at have a title and post.",
    });
  } else if (rating < 1) {
    next({
      name: "RatingRangeError",
      message: "Ratings are between 1 and 5 stars :)",
    });
  } else {
    try {
      const check = await Reviews.userReviewExists(req.user.id, productId);
      if (check) {
        next({
          name: "ReviewLimitReached",
          message: "Only one review per customer per product allowed.",
        });
      } else {
        const review = await Reviews.createReview({
          productId,
          userId: req.user.id,
          title,
          post,
          rating,
        });

        review.author = { userId: review.userId, username: req.user.username };
        delete review.productId;

        res.send({ message: "Successfully posted review!", review });
      }
    } catch (error) {
      next(error);
    }
  }
});

// Route that allows a user to delete their own review.
reviewsRouter.delete("/:reviewId", authRequired, async (req, res, next) => {
  const { reviewId } = req.params;
  try {
    const checkReview = await Reviews.getReviewById(reviewId);
    if (checkReview.userId === req.user.id || req.user.isAdmin) {
      const review = await Reviews.deleteReview(reviewId);
      if (review.id) {
        res.send({ message: "Successfully deleted review!", review });
      } else {
        next({
          name: "NonExistentReview",
          message: "Review somehow does not exist :/",
        });
      }
    } else {
      next({
        name: "AuthorizationRequired",
        message:
          "You must be the author or an administrator to delete a review.",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = reviewsRouter;