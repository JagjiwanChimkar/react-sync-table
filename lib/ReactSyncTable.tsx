import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import snakeCase from "lodash-es/snakeCase";
import React, { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Creatable from "react-select/creatable";
import DurationSelect from "./DurationSelect";
import NumberInput from "./NumberInput";
import SingleValueStyle from "./SingleValueStyle";

const ReactSyncTable = ({
  tableName,
  schema,
  data,
  onChange,
  errors = [],
  hasError = false,
  maxWidth = "1000px",
}) => {
  const tableId = snakeCase(tableName);

  const windowWidth = document.documentElement.clientWidth;

  const inputRef = useRef<Array<Array<HTMLInputElement>>>([[], []]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const listener = (event) => {
    const pathIds = event?.path?.map((p) => p.id);
    const inTable = pathIds?.indexOf(tableId) > -1;
    if (pathIds?.length > 0 && !inTable && menuOpen) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", listener, true);

    return () => {
      window.removeEventListener("click", listener);
    };
    // eslint-disable-next-line
  }, [menuOpen]);

  const tableItem = schema.reduce((accumulator, value) => {
    return {
      ...accumulator,
      [value.header]: value.type === "input" ? "" : undefined,
    };
  }, {});

  const getEmptyRow = () => ({ ...tableItem });

  const isRowFilled = (index) => {
    return data?.[index] != null;
  };

  const handleRemoveTableItem = (index) => {
    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    onChange(newData);
  };

  const handleItemInputChange = (
    evt,
    index,
    action,
    columnIndex,
    dat,
    moveFocus = true
  ) => {
    if (data == null) {
      data = [];
    }

    if (dat?.closeOnSelection) {
      setMenuOpen(false);
    }

    let itemKey, itemValue;

    if (action != null) {
      itemKey = action.name.split("-")[0];
      itemValue = evt?.value;
    } else {
      itemKey = evt.target.name;
      itemValue = evt.target.value;
    }

    let tableItem = data[index];

    if (tableItem == null) {
      tableItem = getEmptyRow();
      data.push(tableItem);
    }

    if (dat.autoSetTodayDateField && !tableItem[dat.autoSetTodayDateField]) {
      tableItem[dat.autoSetTodayDateField] = dayjs();
    }

    tableItem[itemKey] = itemValue;

    dat?.setRespectiveDetail?.forEach((key) => {
      tableItem[key] = evt.target?.otherDetails?.[key];
    });

    if (moveFocus) {
      handleFocus(index, columnIndex);
    }

    onChange([...data]);
  };

  const handleTextInput = (value, index, header) => {
    if (data == null) {
      data = [];
    }

    let tableItem = data[index];
    if (tableItem == null) {
      tableItem = getEmptyRow();
      data.push(tableItem);
    }
    tableItem[header] = value;
    onChange([...data]);
  };

  const handleFocus = (index, columnIndex) => {
    const next = inputRef.current[index][columnIndex + 1];
    if (next) {
      next.focus();
    }
  };

  const handleRef = (ref, index, columnIndex) => {
    inputRef.current[index] ??= [];
    inputRef.current[index][columnIndex] = ref;
  };

  return (
    <Table
      sx={{
        maxWidth,
        border: "1px solid rgba(224, 224, 224, 1)",
        "& td": {
          border: "1px solid rgba(224, 224, 224, 1)",
          p: 0,
        },
        "& th": {
          border: "1px solid rgba(224, 224, 224, 1)",
          p: 1,
        },
      }}
      id={tableId}
    >
      <TableHead>
        <TableRow>
          <TableCell width="35px" align="center">
            #
          </TableCell>
          {schema.map((dat) => {
            return (
              <TableCell key={dat.headerName} width={dat.width}>
                {dat.headerName}
              </TableCell>
            );
          })}
          <TableCell width={"35px"}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...(data ?? []), getEmptyRow()].map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell
                key={index}
                sx={{ textAlign: "center", pt: "0.5rem !important" }}
              >
                {index + 1}
              </TableCell>
              {schema.map((dat, columnIndex) => {
                switch (dat.type) {
                  case "display":
                    return (
                      <TableCell
                        key={`${dat.headerName}-${index}`}
                        sx={{ p: "0.5rem !important" }}
                      >
                        {item[dat?.header]}
                      </TableCell>
                    );

                  case "select":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <>
                          <div>{dat?.headerName}</div>
                          <Creatable
                            isClearable
                            menuIsOpen={
                              windowWidth < 450
                                ? undefined
                                : index === currentIndex && menuOpen
                            }
                            tabSelectsValue={false}
                            name={`${dat.header}-${index}`}
                            blurInputOnSelect={dat?.closeOnSelection}
                            onChange={(e, action) => {
                              if (dat?.closeOnSelection) {
                                setMenuOpen(false);
                              }
                              handleItemInputChange(
                                e,
                                index,
                                action,
                                columnIndex,
                                dat
                              );
                            }}
                            value={{
                              value: item[dat?.header] ?? "",
                              label: item[dat?.header] ?? "",
                            }}
                            components={{
                              DropdownIndicator: () => null,
                              IndicatorSeparator: () => null,
                            }}
                            options={dat.options}
                            styles={SingleValueStyle(
                              hasError && !!errors?.[index]?.[dat?.header]
                            )}
                            onFocus={() => {
                              setMenuOpen(true);
                              setCurrentIndex(index);
                            }}
                            ref={(ref) => handleRef(ref, index, columnIndex)}
                            onBlur={() => setMenuOpen(false)}
                          />
                        </>
                      </TableCell>
                    );
                  case "input":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <>
                          <div>{dat?.headerName}</div>
                          <TextField
                            sx={{
                              border: "none",
                              backgroundColor: "#fff",
                              borderRadius: 0,
                              display: "inline-block",
                              "& fieldset": {
                                border: "none",
                              },
                            }}
                            value={data?.[index]?.[dat.header] ?? ""}
                            onChange={(value) => {
                              handleTextInput(value, index, dat.header);
                            }}
                            ref={(ref) => handleRef(ref, index, columnIndex)}
                          />
                        </>
                      </TableCell>
                    );

                  case "duration-select":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <>
                          <div>{dat?.headerName}</div>
                          <DurationSelect
                            index={index}
                            value={item[dat?.header] ?? ""}
                            name={`${dat.header}-${index}`}
                            handleItemInputChange={(e, index, action) =>
                              handleItemInputChange(
                                e,
                                index,
                                action,
                                columnIndex,
                                dat
                              )
                            }
                            menuIsOpen={
                              windowWidth < 450
                                ? undefined
                                : index === currentIndex && menuOpen
                            }
                            onFocus={() => {
                              setMenuOpen(true);
                              setCurrentIndex(index);
                            }}
                            ref={(ref) => handleRef(ref, index, columnIndex)}
                            onBlur={() => setMenuOpen(false)}
                            hasError={
                              hasError && !!errors?.[index]?.[dat?.header]
                            }
                          />
                        </>
                      </TableCell>
                    );

                  case "number":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <NumberInput
                          borderless
                          value={item?.[dat.header] ?? ""}
                          handleChange={(value) => {
                            const event = {
                              target: {
                                value: value,
                                name: dat.header,
                              },
                            };
                            handleItemInputChange(
                              event,
                              index,
                              null,
                              columnIndex,
                              dat,
                              false
                            );
                          }}
                        />
                      </TableCell>
                    );

                  default:
                    return null;
                }
              })}
              <TableCell
                key={`delete-${index}`}
                sx={{ textAlign: "center", pt: "0.2rem !important" }}
              >
                {isRowFilled(index) && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      handleRemoveTableItem(index);
                    }}
                  >
                    <IoCloseCircleOutline size={18} />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReactSyncTable;
