const express = require("express");
const app = express();
const axios = require("axios");
const port = 2900;
const apiKey = "DEMO_KEY";
const sqlite3 = require("sqlite3");

const cache = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.log("Error happened - " + err.message);
  } else {
    console.log("cache database connected");
  }
});

const baseUrls = [
  "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos",
  "https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos",
  "https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/photos",
];

let alreadyCached = false;

app.get("/", async (req, res) => {
  let hasReturned = false;
  const reqBody = req.query;
  if (reqBody.date != undefined && reqBody.date != "") {
    const selectSqlWithOffset = `SELECT imageData FROM IMAGE WHERE date='${reqBody.date}' LIMIT 5 OFFSET ${reqBody.offset}`;
    const selectSqlWithoutOffset = `SELECT imageData FROM IMAGE WHERE date='${reqBody.date}' LIMIT 5`;
    const sql =
      reqBody.offset != undefined &&
      reqBody.offset != "" &&
      parseInt(reqBody.offset)
        ? selectSqlWithOffset
        : selectSqlWithoutOffset;
    console.log(sql);
    cache.all(sql, async (err, data) => {
      if (err) console.log(err);
      if (data.length > 0) {
        alreadyCached = true;
        console.log("0");
        res.json(data);
      } else {
        console.log(alreadyCached);
        const imageLinks = {};
        const imagesInBase64 = {};

        imageLinks[reqBody.date] = [];
        imagesInBase64[reqBody.date] = [];

        await fetchDataFromUrlGivenDate(baseUrls[0], reqBody.date)
          .then((response) =>
            response.data.photos.forEach((element) => {
              imageLinks[reqBody.date].push(element.img_src);
            })
          )
          .catch((err) => {
            if (!hasReturned) {
              res.sendStatus(404);
              hasReturned = true;
            }
          });
        await fetchDataFromUrlGivenDate(baseUrls[1], reqBody.date)
          .then((response) =>
            response.data.photos.forEach((element) => {
              imageLinks[reqBody.date].push(element.img_src);
            })
          )
          .catch((err) => {
            if (!hasReturned) {
              res.sendStatus(404);
              hasReturned = true;
            }
          });
        await fetchDataFromUrlGivenDate(baseUrls[2], reqBody.date)
          .then((response) =>
            response.data.photos.forEach((element) => {
              imageLinks[reqBody.date].push(element.img_src);
            })
          )
          .catch((err) => {
            if (!hasReturned) {
              res.sendStatus(404);
              hasReturned = true;
            }
          });
        if (imageLinks[reqBody.date].length >= 1) {
          let tempBox = [];
          for (let i = 0; i < imageLinks[reqBody.date].length; i++) {
            await getBase64(imageLinks[reqBody.date][i]).then((response) => {
              cacheImage(reqBody.date, imageLinks[reqBody.date][i], response);
              tempBox.push(response);
            });
            if (tempBox.length === 5) {
              if (!hasReturned) {
                res.json(tempBox);
                hasReturned = true;
              }
            }
          }
          console.log("Finished Caching - " + reqBody.date);
        }
      }
    });
  } else {
    console.log("5");
    res.send("Invalid Parameters Provided");
  }
});

const cacheImage = (date, url, blob) => {
  const insertSql = `INSERT INTO IMAGE (date, url, imageData) VALUES ('${date}', '${url}', '${blob}')`;
  cache.run(insertSql, (err) => {
    if (err) return;
    console.log("data cached for next query");
  });
};

const fetchDataFromUrlGivenDate = async (url, date) => {
  const data = await axios.get(url, {
    params: {
      earth_date: date,
      api_key: apiKey,
    },
  });
  return data;
};

const getBase64 = async (url) => {
  const base64 = await axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) =>
      Buffer.from(response.data, "binary").toString("base64")
    );
  return base64;
};

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  let tableCreationSql =
    "CREATE TABLE IMAGE(ID INTEGER PRIMARY KEY AUTOINCREMENT, date DATE NOT NULL, url TEXT NOT NULL, imageData BLOBLOCK NOT NULL)";
  cache.run(tableCreationSql, (err) => {
    if (err) return;
    console.log("Table created in cache");
  });
});
