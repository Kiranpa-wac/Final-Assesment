import React from "react";
import { Card, Form } from "react-bootstrap";
import ReactSlider from "react-slider";
import "./FilterComponent.css";

const FilterComponent = ({ filters, selectedFilters, onFilterChange }) => {
  // Handle checkbox filters.
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

  // Handle slider changes (price range).
  const handleSliderChange = (filterAttribute, values) => {
    onFilterChange({
      ...selectedFilters,
      [filterAttribute]: { min: values[0], max: values[1] },
    });
  };

  // Safely derive [min, max] for the slider, falling back to default if needed.
  const getSelectedRange = (filter) => {
    const defaultMin = Number(filter.options.min_price) || 0;
    const defaultMax = Number(filter.options.max_price) || 999999;

    const stored = selectedFilters[filter.attribute];
    if (stored && typeof stored === "object") {
      // Attempt to parse min & max from stored object
      const parsedMin = Number(stored.min);
      const parsedMax = Number(stored.max);

      // Fallback if they're invalid or NaN
      const finalMin = Number.isFinite(parsedMin) ? parsedMin : defaultMin;
      const finalMax = Number.isFinite(parsedMax) ? parsedMax : defaultMax;

      // Ensure min <= max for the slider
      return [Math.min(finalMin, finalMax), Math.max(finalMin, finalMax)];
    }

    // If not present or invalid, return the default range
    return [defaultMin, defaultMax];
  };

  return (
    <div className="filter-component">
      {filters.map((filter) => {
        // Skip rendering if attribute is "type"
        if (filter.attribute === "type") return null;

        const isArrayOptions = Array.isArray(filter.options);

        if (isArrayOptions) {
          // Render checkboxes for array-based filters
          return (
            <Card key={filter.attribute} className="mb-3">
              <Card.Header>{filter.label}</Card.Header>
              <Card.Body>
                <Form>
                  {filter.options.map((option) => {
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
                  onChange={(values) => handleSliderChange(filter.attribute, values)}
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
