import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import ReactSlider from "react-slider";
import "./FilterComponent.css";

const FilterComponent = ({ filters, selectedFilters, onFilterChange }) => {
  // State to control which filter sections are expanded.
  const [expandedFilters, setExpandedFilters] = useState({});
  // State to store search term for each filter group.
  const [filterSearchTerms, setFilterSearchTerms] = useState({});

  const handleCheckboxChange = (filterAttribute, optionName, checked) => {
    const currentSelection = selectedFilters[filterAttribute] || [];
    const newSelection = checked
      ? [...currentSelection, optionName]
      : currentSelection.filter((name) => name !== optionName);
    onFilterChange({
      ...selectedFilters,
      [filterAttribute]: newSelection,
    });
  };

  const handleSliderChange = (filterAttribute, values) => {
    onFilterChange({
      ...selectedFilters,
      [filterAttribute]: { min: values[0], max: values[1] },
    });
  };

  const getSelectedRange = (filter) => {
    const defaultMin = Number(filter.options.min_price) || 0;
    const defaultMax = Number(filter.options.max_price) || 999999;
    const stored = selectedFilters[filter.attribute];
    if (stored && typeof stored === "object") {
      const parsedMin = Number(stored.min);
      const parsedMax = Number(stored.max);
      const finalMin = Number.isFinite(parsedMin) ? parsedMin : defaultMin;
      const finalMax = Number.isFinite(parsedMax) ? parsedMax : defaultMax;
      return [Math.min(finalMin, finalMax), Math.max(finalMin, finalMax)];
    }
    return [defaultMin, defaultMax];
  };

  const toggleExpand = (filterAttribute) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterAttribute]: !prev[filterAttribute],
    }));
  };

  const handleSearchTermChange = (filterAttribute, term) => {
    setFilterSearchTerms({
      ...filterSearchTerms,
      [filterAttribute]: term,
    });
  };

  return (
    <div className="filter-component">
      {filters.map((filter) => {
        // Skip rendering if attribute is "type"
        if (filter.attribute === "type") return null;

        const isArrayOptions = Array.isArray(filter.options);
        if (isArrayOptions) {
          // For array-based filters, get the search term
          const searchTerm = filterSearchTerms[filter.attribute] || "";
          // Filter options based on search term if provided
          let filteredOptions = filter.options;
          if (searchTerm.trim() !== "") {
            filteredOptions = filter.options.filter((option) =>
              option.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          // Define threshold & collapsed count for "Show More/Less"
          const threshold = 5;
          const collapsedCount = 3;
          const expanded = expandedFilters[filter.attribute] || false;
          // If no search term and there are too many options, show truncated list.
          const optionsToShow =
            searchTerm.trim() === "" && filteredOptions.length > threshold && !expanded
              ? filteredOptions.slice(0, collapsedCount)
              : filteredOptions;

          return (
            <Card key={filter.attribute} className="mb-3">
              <Card.Header>{filter.label}</Card.Header>
              <Card.Body>
                {/* Search bar for this filter */}
                <Form.Control
                  type="text"
                  placeholder={`Search ${filter.label}...`}
                  value={searchTerm}
                  onChange={(e) =>
                    handleSearchTermChange(filter.attribute, e.target.value)
                  }
                  className="mb-2"
                />
                <Form>
                  {optionsToShow.map((option) => {
                    const currentValues = selectedFilters[filter.attribute] || [];
                    const checked = currentValues.includes(option.name);
                    return (
                      <Form.Check
                        key={option.name}
                        type="checkbox"
                        id={`${filter.attribute}-${option.name}`}
                        label={`${option.label} (${option.count})`}
                        checked={checked}
                        onChange={(e) =>
                          handleCheckboxChange(
                            filter.attribute,
                            option.name,
                            e.target.checked
                          )
                        }
                      />
                    );
                  })}
                  {filteredOptions.length > threshold && searchTerm.trim() === "" && (
                    <div className="mt-2">
                      <Button
                        variant="link"
                        onClick={() => toggleExpand(filter.attribute)}
                      >
                        {expanded ? "Show Less" : "Show More"}
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          );
        } else {
          // Render a range slider for object-based filters (e.g., Price)
          const [selectedMin, selectedMax] = getSelectedRange(filter);
          return (
            <Card key={filter.attribute} className="mb-3">
              <Card.Header>{filter.label}</Card.Header>
              <Card.Body>
                <ReactSlider
                  className="horizontal-slider my-3"
                  thumbClassName="slider-thumb"
                  trackClassName="slider-track"
                  min={Number(filter.options.min_price) || 0}
                  max={Number(filter.options.max_price) || 999999}
                  value={[selectedMin, selectedMax]}
                  onChange={(values) =>
                    handleSliderChange(filter.attribute, values)
                  }
                  pearling
                  minDistance={1}
                />
                <div className="d-flex justify-content-between mt-2">
                  <span>Min: {selectedMin}</span>
                  <span>Max: {selectedMax}</span>
                </div>
              </Card.Body>
            </Card>
          );
        }
      })}
    </div>
  );
};

export default FilterComponent;
