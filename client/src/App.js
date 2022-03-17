import React, { useState, useRef, useEffect } from "react";
import ImageList from "./ImageList";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_IMAGE_KEY = "nasaApp.images";
const LOCAL_STORAGE_OFFSET_KEY = "nasaApp.offset";

const IMAGE_API_URL = "http://localhost:2900/";
function App() {
  const [images, setImages] = useState([]);
  const [offset = 0, setOffset] = useState([]);
  const imageDateRef = useRef();

  // useEffect(() => {
  //   const storedImages = JSON.parse(
  //     localStorage.getItem(LOCAL_STORAGE_IMAGE_KEY)
  //   );
  //   const storedOffset = JSON.parse(
  //     localStorage.getItem(LOCAL_STORAGE_OFFSET_KEY)
  //   );
  //   if (storedImages) setImages(storedImages);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_IMAGE_KEY, JSON.stringify(images));
  // }, [images]);
  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_OFFSET_KEY, JSON.stringify(offset));
  // }, [offset]);

  async function handleImageFetch(e) {
    const date = imageDateRef.current.value;
    setOffset((prevOffset) => {
      if (Array.isArray(prevOffset)) {
        return 0;
      } else {
        return prevOffset + 5;
      }
    });
    if (date === "") return;
    const data = await (
      await fetch(IMAGE_API_URL + "?date=" + date + "&offset=" + offset)
    ).json();
    if (data[0].imageData === undefined) {
      setImages(() => {
        return [...data];
      });
    } else {
      setImages(() => {
        const imageArray = [];
        data.forEach((element) => {
          imageArray.push(element.imageData);
        });
        console.log(imageArray);
        return [...imageArray];
      });
    }

    console.log(offset);
  }

  async function handleImageFetchReverse(e) {
    setOffset((prevOffset) => {
      if (parseInt(prevOffset)) {
        return parseInt(prevOffset) - 5;
      } else {
        return 0;
      }
    });

    const date = imageDateRef.current.value;
    if (date === "") return;
    const data = await (
      await fetch(IMAGE_API_URL + "?date=" + date + "&offset=" + offset)
    ).json();
    if (data[0].imageData === undefined) {
      setImages(() => {
        return [...data];
      });
    } else {
      setImages(() => {
        const imageArray = [];
        data.forEach((element) => {
          imageArray.push(element.imageData);
        });
        console.log(imageArray);
        return [...imageArray];
      });
    }

    console.log(offset);
  }

  return (
    <>
      <label>Date of images: </label>
      <input ref={imageDateRef} type="text" />
      <button onClick={handleImageFetch}>Fetch images in blocks of 5</button>
      <button onClick={handleImageFetchReverse}>Go back in blocks of 5</button>

      <ImageList images={images}></ImageList>
    </>
  );
}

export default App;
