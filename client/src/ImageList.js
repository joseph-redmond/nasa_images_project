import React from "react";
import Image from "./Image";
export default function ImageList({ images }) {
  return images.map((image) => {
    return <Image image={image} />;
  });
}
