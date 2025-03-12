import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import ReactSlider from "react-slider";
import "./FilterComponent.css";

const FilterComponent = ({ filters, onFilterChange }) => {
  
  const [selectedFilters, setSelectedFilters] = useState({});

  // Handle changes for checkbox filters.
  const handleCheckboxChange = (filterAttribute, optionName, checked) => {
    setSelectedFilters((prev) => {
      const current = prev[filterAttribute] || [];
      const newSelection = checked
        ? [...current, optionName]
        : current.filter((name) => name !== optionName);
      const updated = { ...prev, [filterAttribute]: newSelection };
      if (onFilterChange) {
        onFilterChange(updated);
      }
      return updated;
    });
  };

  // Handle changes for the slider (price range).
  const handleSliderChange = (filterAttribute, [minValue, maxValue]) => {
    setSelectedFilters((prev) => {
      const updatedPriceRange = { min: minValue, max: maxValue };
      const updated = { ...prev, [filterAttribute]: updatedPriceRange };
      if (onFilterChange) {
        onFilterChange(updated);
      }
      return updated;
    });
  };

  // Helper to get the current selected min/max for a given filter,
  // or default to the filter's min_price/max_price.
  const getSelectedRange = (filter) => {
    const savedRange = selectedFilters[filter.attribute];
    if (savedRange) {
      return [Number(savedRange.min), Number(savedRange.max)];
    }
    return [filter.options.min_price, filter.options.max_price];
  };

  return (
    <div className="filter-component">
      {filters.map((filter) => {
        // Skip rendering the filter if its attribute is "type"
        if (filter.attribute === "type") return null;

        const isArrayOptions = Array.isArray(filter.options);
        const [selectedMin, selectedMax] = !isArrayOptions
          ? getSelectedRange(filter)
          : [null, null];

        return (
          <Card key={filter.attribute} className="mb-3">
            <Card.Header>{filter.label}</Card.Header>
            <Card.Body>
              {isArrayOptions ? (
                // Render checkbox list for filters with array options.
                <Form>
                  {filter.options.map((option) => (
                    <Form.Check
                      key={option.name}
                      type="checkbox"
                      id={`${filter.attribute}-${option.name}`}
                      label={`${option.label} (${option.count})`}
                      onChange={(e) =>
                        handleCheckboxChange(
                          filter.attribute,
                          option.name,
                          e.target.checked
                        )
                      }
                    />
                  ))}
                </Form>
              ) : (
                // Render a range slider for filters with object options (e.g., Price).
                <div>
                  <ReactSlider
                    className="horizontal-slider my-3"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    min={filter.options.min_price}
                    max={filter.options.max_price}
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
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default FilterComponent;
