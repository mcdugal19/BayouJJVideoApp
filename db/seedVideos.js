const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/**
 * Fetch request from YouTube API to seed our products table
 */

async function fetchTechniques() {
  try {
    const response = await fetch("https://youtube.googleapis.com/youtube/v3/channels?key=[AIzaSyCHpVKlfkBVj7M7UoRpzDDWQODS5B7GWeE]");
    const { video } = await response.json();

    // modify each returned object to better fit our database table structure
    const optimizedArray = await Promise.all(
      video.map((videoObj) => {
        const newObj = {
          videoId: videoObj.videoId,
        };

        return newObj;
      })
    );
    return optimizedArray;
  } catch (error) {
    console.error(error);
  }
}

module.exports = fetchTechniques;

