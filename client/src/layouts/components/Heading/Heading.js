import React from "react";

function Heading({ title }) {
  return (
    <div className="col text-center">
      {" "}
      <div
        className="section_title new_arrivals_title"
        style={{ marginTop: "74px" }}
      >
        {" "}
        <h2> {title}</h2>{" "}
      </div>{" "}
    </div>
  );
}

export default Heading;
