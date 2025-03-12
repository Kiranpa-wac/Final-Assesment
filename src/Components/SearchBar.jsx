import React from "react";
import { Form, Button } from "react-bootstrap";

const SearchBar = ({ search, setSearch, handleSubmit }) => {
  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="primary" className="ms-2">
          Search
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SearchBar;
