import React, { forwardRef, useMemo, useState } from "react";
import Creatable from "react-select/creatable";
import SingleValueStyle from "./SingleValueStyle";

const DurationSelect = (
  {
    menuIsOpen,
    index,
    value,
    name,
    handleItemInputChange,
    onFocus,
    onBlur,
    hasError,
  },
  ref
) => {
  const [num, setNum] = useState(0);

  const handleInputChange = (e) => {
    if (e === "") {
      setNum(0);
    } else {
      setNum(parseInt(e));
    }
  };

  const handleOptions = useMemo(() => {
    let DURATION_OPTIONS = [
      { label: "_Day", value: "0 Day" },
      { label: "_Week", value: "0 Week" },
      { label: "_Month", value: "0 Month" },
      { label: "_Year", value: "0 Year" },
    ];
    if (num !== 0) {
      const options =
        num > 1
          ? ["Days", "Weeks", "Months", "Years"]
          : ["Day", "Week", "Month", "Year"];
      DURATION_OPTIONS = options.map((obj) => {
        return { value: `${num} ${obj}`, label: `${num} ${obj}` };
      });
    }
    return DURATION_OPTIONS;
  }, [num]);

  return (
    <Creatable
      ref={ref}
      menuIsOpen={menuIsOpen}
      openMenuOnFocus={true}
      tabSelectsValue={false}
      isClearable
      name={name}
      options={handleOptions}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
      }}
      value={{
        value: value,
        label: value,
      }}
      onChange={(e, action) => {
        handleItemInputChange(e, index, action);
      }}
      onInputChange={(e, action) => {
        if (action.action === "input-change") {
          handleInputChange(e);
        }
      }}
      styles={SingleValueStyle(hasError)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default forwardRef(DurationSelect);
