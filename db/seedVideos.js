const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * Fetch request from YouTube API to seed our products table
 */

async function fetchVideos() {
  try {
    const response = await fetch("https://www.googleapis.com/youtube/v3/videos?part=player&id={videoId}&key=api key");
    const { video } = await response.json();

    // modify each returned object to better fit our database table structure
    const optimizedArray = await Promise.all(
      video.map((videoObj) => {
        const newObj = {
          name: videoObj.character,
        };

        videoObj.character === videoObj.name
          ? (newObj.variation = null)
          : (newObj.variation = videoObj.name);

        newObj.game = videoObj.gameSeries;
        newObj.image = videoObj.image;

        // Builds value of description property based on various criteria from original returned objects
        videoObj.release.na
          ? (newObj.description = `Released in North America ${new Date(
              videoObj.release.na
            ).toDateString()}, this ${
              videoObj.character
            } ${videoObj.type.toLowerCase()} amiibo was produced as part of the ${
              videoObj.amiiboSeries
            } collection.`)
          : videoObj.release.jp
          ? (newObj.description = `Released in Japan ${new Date(
              videoObj.release.jp
            ).toDateString()} without a North American release, this ${
              videoObj.character
            } ${videoObj.type.toLowerCase()} amiibo was produced as part of the ${
              videoObj.amiiboSeries
            } collection.`)
          : (newObj.description = `This ${videoObj.character} amiibo was produced as part of the ${videoObj.amiiboSeries} collection.`);

        videoObj.release.na ? (newObj.price = 19.99) : (newObj.price = 39.99);
        newObj.inventory = 10;

        return newObj;
      })
    );
    return optimizedArray;
  } catch (error) {
    console.error(error);
  }
}

module.exports = fetchVideos;
