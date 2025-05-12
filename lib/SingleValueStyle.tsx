const style = (hasError = false, isBorderless = true) => ({
  control: (base) => ({
    ...base,
    border:
      !isBorderless || hasError || document.documentElement.clientWidth < 450
        ? null
        : 0,
    borderColor: hasError ? "#da292e" : "lightgrey",
    // This line disable the blue border
    // boxShadow: 'none',
    menu: "inline",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#fff",
    },
    borderRadius:
      !isBorderless || hasError || document.documentElement.clientWidth < 450
        ? "3px"
        : 0,
    cursor: "pointer",
  }),
  menuList: (base) => ({
    ...base,
    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#fff",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#2857a5;",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#888",
    },
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  groupHeading: (base) => ({
    ...base,
    top: 0,
    flex: "1 1",
    color: "white",
    fontWeight: "bolder",
    backgroundColor: "purple",
    padding: 10,
    margin: 0,
  }),
});

export default style;
