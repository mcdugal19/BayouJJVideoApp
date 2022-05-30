const express = require("express");
const videosRouter = express.Router();
const { Videos } = require("../db");
const { adminRequired } = require("./utils");

// Route that sends back product information from every video.
videosRouter.get("/", async (req, res, next) => {
  try {
    const videos = await Videos.getAllVideos();
    res.send(videos);
  } catch (error) {
    next(error);
  }
});

// Admin only route that will add a new product to the database. Sends back success message / product info.
videosRouter.post("/", adminRequired, async (req, res, next) => {
  const { videoObj } = req.body;
  const { name, variation, image, description} =
    videoObj;
  if (!name || !description) {
    next({
      name: "RequiredFields",
      message:
        "Videos must at least have a name, and description.",
    });
  } else {
    try {
      const video = await Videos.createVideo({
        name,
        variation,
        image,
        description,
      });

      res.send({ message: "Successfully added video!", video });
    } catch (error) {
      next(error);
    }
  }
});

// Admin only route to update a specific product's information.
videosRouter.patch("/:videoId", adminRequired, async (req, res, next) => {
  const { videoId } = req.params;
  const { name, variation, image, description } =
    req.body;

  // build update object
  const updateObj = { id: videoId };
  updateObj.name = name;
  updateObj.variation = variation;
  updateObj.image = image;
  updateObj.description = description;

  try {
    const video = await Videos.updateVideo(updateObj);

    res.send({ message: "Successfully updated video!", video });
  } catch (error) {
    next(error);
  }
});

// Admin only route to delete a specific product from the database.
videosRouter.delete("/:videoId", adminRequired, async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const video = await Videos.deleteVideo(videoId);

    res.send({
      message: "Video successfully deleted from the database.",
      video,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = videosRouter;
