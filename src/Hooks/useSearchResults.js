import { useState } from "react";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 28;

export const useSearchResults = (urlQuery, filtersParam, sortBy, clientType) => {
  const [currentPage, setCurrentPage] = useState(0);

  const getKey = (pageIndex, previousPageData) => {
    if (!urlQuery) return null;
    if (previousPageData && previousPageData.items.length === 0) return null;
    return [
      "https://uat.search-assist.webc.in/api/search",
      urlQuery,
      filtersParam,
      sortBy,
      clientType,
      pageIndex + 1,
      PAGE_SIZE,
    ];
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    // The fetcher is passed from the parent; see below
    undefined,
    { initialSize: currentPage + 1, revalidateOnFocus: false }
  );

  const totalItems = data && data[0] ? data[0].total : 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const currentData = data ? data[currentPage] : null;
  const items = currentData?.items || [];

  const updatePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (pageNumber >= size) {
      setSize(size + 1);
    }
  };

  return { data, error, isValidating, items, totalPages, currentPage, updatePage, setSize, size };
};

export default useSearchResults;
