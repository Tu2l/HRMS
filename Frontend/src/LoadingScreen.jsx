import React from "react";
import ReactLoading from "react-loading";

export default function LoadingScreen() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "transparent",
      }}
    >
      <center>
        <div style={{ marginTop: "41vh" }}>
          <ReactLoading
            type={"balls"}
            color="rgba(237, 89, 15, 0.8)"
            width={60}
          />
        </div>
      </center>
    </div>
  );
}
