import React, { useState } from "react";

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = async (value) => {
    await setFilter(value || undefined);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <span className="mr-2 text-center">Search: </span>
        <input
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          className="form-control"
        />
      </div>
    </>
  );
};

export default GlobalFilter;
