import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import snakeCase from "lodash-es/snakeCase";
import { useEffect, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import type { ActionMeta, SingleValue } from "react-select";
import Creatable from "react-select/creatable";
import DurationSelect from "./DurationSelect";
import NumberInput from "./NumberInput";
import SingleValueStyle from "./SingleValueStyle";

export interface SchemaItem {
  header: string;
  headerName: string;
  type: "display" | "dropdown" | "text" | "duration" | "number";
  width?: string;
  options?: Array<{ value: string; label: string }>;
  closeOnSelection?: boolean;
  setRespectiveDetail?: string[];
}

interface ReactSyncTableProps<T> {
  tableName: string;
  schema: SchemaItem[];
  data: T[];
  onChange: (data: T[]) => void;
  errors?: Array<Record<string, string>>;
  hasError?: boolean;
  maxWidth?: string;
}

type SelectOption = { value: string; label: string };
type InputEvent = {
  value?: string;
  target?: {
    name: string;
    value: string;
    otherDetails?: Record<string, unknown>;
  };
};

const isInputEvent = (evt: unknown): evt is InputEvent => {
  return evt !== null && typeof evt === "object" && "target" in evt;
};

const ReactSyncTable = <T extends Record<string, unknown>>({
  tableName,
  schema,
  data,
  onChange,
  errors = [],
  hasError = false,
  maxWidth = "1000px",
}: ReactSyncTableProps<T>) => {
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

  const getEmptyRow = (): T => {
    const emptyRow = schema.reduce((accumulator, value) => {
      return {
        ...accumulator,
        [value.header]: value.type === "text" ? "" : undefined,
      };
    }, {} as Record<string, unknown>) as T;

    return emptyRow;
  };

  const isRowFilled = (index) => {
    return data?.[index] != null;
  };

  const handleRemoveTableItem = (index) => {
    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    onChange(newData);
  };

  const handleItemInputChange = (
    evt: SingleValue<SelectOption> | InputEvent | null,
    index: number,
    action: ActionMeta<SelectOption> | null,
    columnIndex: number,
    dat: SchemaItem,
    moveFocus = true
  ) => {
    const localData = [...(data ?? [])];

    if (dat?.closeOnSelection) {
      setMenuOpen(false);
    }

    let itemKey: keyof T;
    let itemValue: unknown;

    if (action?.name) {
      itemKey = action.name.split("-")[0] as keyof T;
      if (evt && "value" in evt) {
        itemValue = (evt as SelectOption).value ?? "";
      } else {
        return;
      }
    } else if (isInputEvent(evt) && evt.target) {
      itemKey = evt.target.name as keyof T;
      itemValue = evt.target.value;
    } else {
      return; // Exit if we don't have valid input
    }

    const tableItem = localData[index] ?? getEmptyRow();

    if (index >= localData.length) {
      localData.push(tableItem);
    }

    tableItem[itemKey] = itemValue as T[keyof T];

    if (isInputEvent(evt) && evt.target?.otherDetails) {
      dat?.setRespectiveDetail?.forEach((key) => {
        const detailKey = key as keyof T;
        tableItem[detailKey] = evt.target!.otherDetails![key] as T[keyof T];
      });
    }

    if (moveFocus) {
      handleFocus(index, columnIndex);
    }

    onChange(localData);
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
    (tableItem as Record<string, unknown>)[header] = value.target.value;
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
      <TableHead sx={{ bgcolor: "rgb(244, 244, 244)" }}>
        <TableRow>
          <TableCell width="5%" align="center">
            #
          </TableCell>
          {schema.map((dat) => {
            return (
              <TableCell key={dat.headerName} width={dat.width}>
                {dat.headerName}
              </TableCell>
            );
          })}
          <TableCell width="5%"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...(data ?? []), getEmptyRow()].map((item, index) => {
          return (
            <TableRow key={index}>
              <TableCell key={index} sx={{ textAlign: "center" }}>
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
                        {String(item[dat?.header] ?? "")}
                      </TableCell>
                    );

                  case "dropdown":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <>
                          <Creatable<SelectOption>
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
                              value: String(item[dat?.header] ?? ""),
                              label: String(item[dat?.header] ?? ""),
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

                  case "text":
                    return (
                      <TableCell key={`${dat.headerName}-${index}`}>
                        <TextField
                          multiline
                          size="small"
                          sx={{
                            width: "100%",
                            border: "none",
                            backgroundColor: "#fff",
                            borderRadius: 0,
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
                      </TableCell>
                    );

                  case "duration":
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
