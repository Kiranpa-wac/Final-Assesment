import React from "react";
import { Form } from "react-bootstrap";

const SortAndClientControls = ({ clientType, sortBy, onClientChange, onSortChange }) => {
  return (
    <div className="d-flex justify-content-end mb-3">
      <Form.Select
        value={clientType}
        onChange={onClientChange}
        style={{ width: "150px", marginRight: "10px" }}
      >
        <option value="en">Quater en</option>
        <option value="ar">Quater ar</option>
      </Form.Select>
      <Form.Select
        value={sortBy}
        onChange={onSortChange}
        style={{ width: "150px" }}
      >
        <option value="1">Relevance</option>
        <option value="2">Price high to low</option>
        <option value="3">Price low to high</option>
        <option value="4">Newest</option>
      </Form.Select>
    </div>
  );
};

export default SortAndClientControls;
