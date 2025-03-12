import React from "react";
import { Pagination } from "react-bootstrap";

const ResultsPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination className="justify-content-center">
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      />
      {Array.from({ length: totalPages }).map((_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
      />
    </Pagination>
  );
};

export default ResultsPagination;
