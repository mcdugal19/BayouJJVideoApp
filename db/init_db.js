const { client, Videos, User, Reviews } = require("./");
const fetchVideos = require("./seedVideos");

async function buildTables() {
  try {
    client.connect();

    await client.query(`
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS videos;
    
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      "isAdmin" BOOLEAN DEFAULT false
    );

    CREATE TABLE videos( 
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      variation VARCHAR(255),
      game VARCHAR(255),
      image VARCHAR(255),
      description VARCHAR(255),
      price MONEY NOT NULL,
      inventory INTEGER NOT NULL
    );

    CREATE TABLE reviews(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "userId" INTEGER REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      post VARCHAR(255) NOT NULL,
      rating INTEGER DEFAULT null
    );

    `);
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  console.log("Seeding database...");
  console.log("Seeding videos...");
  try {
    const videos = await fetchVideos();
    const videos = await Promise.all(
      videos.map((video) => {
        const video = Videos.createVideo(video);
        return video;
      })
    );
    if (videos.length > 0) {
      console.log("Seeded videos!");
    }

    console.log("Seeding users...");

    const usersToCreate = [
      { username: "derk", password: "test", email: "asd2f@gmail.com" },
      { username: "Joel", password: "test", email: "asd321f@gmail.com" },
      { username: "Lance", password: "test", email: "as1asddf@gmail.com" },
      { username: "Zinoviy", password: "test", email: "asdfef@gmail.com" },
      { username: "Theodosios", password: "test", email: "aasdfsdf@gmail.com" },
      { username: "Hardwin", password: "test", email: "aedfssdf@gmail.com" },
      { username: "Alard", password: "test", email: "asefsdfdf@gmail.com" },
      { username: "Sinem", password: "test", email: "asdsdff@gmail.com" },
      { username: "Zhivko", password: "test", email: "aersdf@gmail.com" },
      { username: "Mari", password: "test", email: "arerwsdf@gmail.com" },
      { username: "Ivanka", password: "test", email: "asdasdfsf@gmail.com" },
    ];

    const users = await Promise.all(usersToCreate.map(User.createUser));
    console.log("Seeded users!");

    const adminAccount = await User.getUserByUsername("derk");
    const adminAccount2 = await User.getUserByUsername("Joel");
    const adminAccount3 = await User.getUserByUsername("Lance");

    const admin = await User.updateUser({ id: adminAccount.id, isAdmin: true });
    const admin2 = await User.updateUser({
      id: adminAccount2.id,
      isAdmin: true,
    });
    const admin3 = await User.updateUser({
      id: adminAccount3.id,
      isAdmin: true,
    });
    console.log("Updated users to admin: ", admin, admin2, admin3);

    console.log("Finished seeding database!");
  } catch (error) {
    console.error("Problem seeding database...", error);
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
