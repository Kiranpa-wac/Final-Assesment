import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import useSWRInfinite from "swr/infinite";
import SearchBar from "../Components/SearchBar";
import FilterComponent from "../Components/FilterComponent";
import useSearch from "../Hooks/useSearch";

const PAGE_SIZE = 28;

const fetcher = async ([url, query, page, size]) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-id": "7645129791",
        "Secret-key": "Qfj1UUkFItWfVFwWpJ65g0VfhjdVGN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: query,
        page: page,
        size: size,
        sort_by: "1",
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch data");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  // Derive initial page from URL (convert to 0-indexed)
  const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;

  const { search, setSearch, handleSubmit } = useSearch();

  // SWRInfinite key function
  const getKey = (pageIndex, previousPageData) => {
    if (!urlQuery) return null;
    if (previousPageData && previousPageData.items.length === 0) return null;
    return ["https://uat.search-assist.webc.in/api/search", urlQuery, pageIndex + 1, PAGE_SIZE];
  };

  const { data, error, size: swrSize, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateOnFocus: false }
  );

  // Local page state
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Ensure enough pages are loaded based on the initial page from the URL.
  useEffect(() => {
    if (swrSize < initialPage + 1) {
      setSize(initialPage + 1);
    }
  }, [initialPage, swrSize, setSize]);

  // Calculate total items/pages from first page’s data
  const totalItems = data && data[0] ? data[0].total : 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Current page data
  const currentData = data ? data[currentPage] : null;
  const items = currentData?.items || [];

  // Extract filters from first page
  const filters = data && data[0] ? data[0].filter_list : [];

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 0 || pageNumber >= totalPages) return;
    if (pageNumber >= swrSize) {
      setSize(swrSize + 1);
    }
    setCurrentPage(pageNumber);
    // Update URL (1-indexed)
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber + 1);
    setSearchParams(newParams);
  };

  const handleFilterChange = (selectedFilters) => {
    console.log("Selected filters:", selectedFilters);
    // Extend this to trigger filtered searches
  };

  return (
    <Container fluid className="py-4">
      {/* Search Bar (full width) */}
      <Row>
        <Col xs={12} className="mb-3">
          <SearchBar search={search} setSearch={setSearch} handleSubmit={handleSubmit} />
        </Col>
      </Row>

      {/* Heading (full width) */}
      <Row>
        <Col xs={12}>
          <h2 className="mb-4 text-center">Search Results for: {urlQuery}</h2>
        </Col>
      </Row>

      {/* Main content: Filters on left, results on right */}
      <Row>
        <Col md={3} className="mb-4">
          {filters.length > 0 && (
            <FilterComponent filters={filters} onFilterChange={handleFilterChange} />
          )}
        </Col>
        <Col md={9}>
          {isValidating && !data && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}

          {error && (
            <Alert variant="danger">
              <Alert.Heading>Oops!</Alert.Heading>
              <p>{error.message}</p>
            </Alert>
          )}

          {data && !error && (
            <>
              <Row xs={1} md={4} className="g-4 mb-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <Col key={item.id}>
                      <Card className="h-100">
                        <Card.Img
                          variant="top"
                          src={item.image_link}
                          alt={item.title}
                          className="img-fluid rounded"
                        />
                        <Card.Body>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text className="fw-bold">
                            Price: {item.sale_price}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col className="text-center">
                    <p className="lead">Results not found</p>
                  </Col>
                )}
              </Row>

              <Pagination className="justify-content-center">
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                />
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage + 1 >= totalPages}
                />
              </Pagination>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
