import React, { useState } from "react";
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

const fetcher = async ([url, query, filtersParam, page, size]) => {
  try {
    // Parse selected filters from the URL (if any)
    const filter = filtersParam ? JSON.parse(filtersParam) : {};
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-id": "7645129791",
        "Secret-key": "Qfj1UUkFItWfVFwWpJ65g0VfhjdVGN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: query,
        filter, // Pass the selected filters to the API
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
  // Get the filters from the URL as a JSON string (if any)
  const filtersParam = searchParams.get("filters") || "";
  // Derive initial page from URL (convert to 0-indexed)
  const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;

  const { search, setSearch, handleSubmit } = useSearch();

  // SWRInfinite key includes query and filters
  const getKey = (pageIndex, previousPageData) => {
    if (!urlQuery) return null;
    if (previousPageData && previousPageData.items.length === 0) return null;
    return [
      "https://uat.search-assist.webc.in/api/search",
      urlQuery,
      filtersParam,
      pageIndex + 1,
      PAGE_SIZE,
    ];
  };

  // Use initialSize to load enough pages on refresh
  const { data, error, size: swrSize, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    { initialSize: initialPage + 1, revalidateOnFocus: false }
  );

  const [currentPage, setCurrentPage] = useState(initialPage);
  const totalItems = data && data[0] ? data[0].total : 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const currentData = data ? data[currentPage] : null;
  const items = currentData?.items || [];
  const filters = data && data[0] ? data[0].filter_list : [];

  // Parse selected filters from URL or default to empty object.
  const selectedFiltersFromUrl = filtersParam ? JSON.parse(filtersParam) : {};

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 0 || pageNumber >= totalPages) return;
    if (pageNumber >= swrSize) {
      setSize(swrSize + 1);
    }
    setCurrentPage(pageNumber);
    // Update the URL's "page" parameter (1-indexed)
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber + 1);
    setSearchParams(newParams);
  };

  // When filters change, update the URL state immediately and reset the page to 1.
  const handleFilterChange = (updatedFilters) => {
    console.log("Selected filters:", updatedFilters);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("filters", JSON.stringify(updatedFilters));
    // Reset page to 1 when filters change
    newParams.set("page", 1);
    setSearchParams(newParams);
    setCurrentPage(0);
  };

  return (
    <Container fluid className="py-4">
      {/* Search Bar */}
      <Row>
        <Col xs={12} className="mb-3">
          <SearchBar
            search={search}
            setSearch={setSearch}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>

      {/* Heading */}
      <Row>
        <Col xs={12}>
          <h2 className="mb-4 text-center">
            Search Results for: {urlQuery}
          </h2>
        </Col>
      </Row>

      {/* Main content: Filters on left, results on right */}
      <Row>
        <Col md={3} className="mb-4">
          {filters.length > 0 && (
            <FilterComponent
              filters={filters}
              selectedFilters={selectedFiltersFromUrl}
              onFilterChange={handleFilterChange}
            />
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
