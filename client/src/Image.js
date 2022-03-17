import React from "react";

export default function Image({ image }) {
  return (
    <div>
      <img src={"data:image/png;base64," + image} alt="nasa pic"></img>
    </div>
  );
}
