import React from "react";
import { Card, Form } from "react-bootstrap";
import ReactSlider from "react-slider";
import "./FilterComponent.css";

const FilterComponent = ({ filters, selectedFilters, onFilterChange }) => {
  // For checkbox filters, selectedFilters[filter.attribute] should be an array.
  // For slider filters, selectedFilters[filter.attribute] should be an object {min, max}.

  const handleCheckboxChange = (filterAttribute, optionName, checked) => {
    const currentSelection = selectedFilters[filterAttribute] || [];
    let newSelection;
    if (checked) {
      newSelection = [...currentSelection, optionName];
    } else {
      newSelection = currentSelection.filter((name) => name !== optionName);
    }
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
    if (selectedFilters && selectedFilters[filter.attribute]) {
      const { min, max } = selectedFilters[filter.attribute];
      return [Number(min), Number(max)];
    }
    return [filter.options.min_price, filter.options.max_price];
  };

  return (
    <div className="filter-component">
      {filters.map((filter) => {
        // Skip rendering the filter if its attribute is "type"
        if (filter.attribute === "type") return null;

        const isArrayOptions = Array.isArray(filter.options);
        let selectedMin = null, selectedMax = null;
        if (!isArrayOptions) {
          [selectedMin, selectedMax] = getSelectedRange(filter);
        }
        return (
          <Card key={filter.attribute} className="mb-3">
            <Card.Header>{filter.label}</Card.Header>
            <Card.Body>
              {isArrayOptions ? (
                // Render checkboxes for array-based filters
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
                      checked={
                        selectedFilters[filter.attribute]
                          ? selectedFilters[filter.attribute].includes(option.name)
                          : false
                      }
                    />
                  ))}
                </Form>
              ) : (
                // Render a range slider for object-based filters (e.g., Price)
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
