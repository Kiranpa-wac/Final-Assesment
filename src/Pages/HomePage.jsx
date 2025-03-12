import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import useSearch from "../Hooks/useSearch";
import SearchBar from "../Components/SearchBar";

const HomePage = () => {
  const { search, setSearch, handleSubmit } = useSearch();

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}></Col>
        <SearchBar
          search={search}
          setSearch={setSearch}
          handleSubmit={handleSubmit}
        />
      </Row>
    </Container>
  );
};

export default HomePage;
