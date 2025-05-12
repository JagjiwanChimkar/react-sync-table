import { useState } from "react";
import { ReactSyncTable } from "../lib/main";
import { SchemaItem } from "../lib/ReactSyncTable";

type DataType = {
  name: string;
  age: number;
};

const tableSchema: SchemaItem[] = [
  {
    header: "country",
    headerName: "Country",
    type: "dropdown",
    options: [
      { label: "IND", value: "IND" },
      { label: "USA", value: "USA" },
      { label: "GHI", value: "GHI" },
    ],
    width: "20%",
  },
  {
    header: "state",
    headerName: "State",
    type: "dropdown",
    options: [
      { label: "MH", value: "MH" },
      { label: "UP", value: "UP" },
      { label: "MP", value: "MP" },
      { label: "GUJ", value: "GUJ" },
    ],
    width: "20%",
  },
  { header: "name", headerName: "Name", type: "text", width: "20%" },
  { header: "age", headerName: "Age", type: "number", width: "20%" },
];

function App() {
  const [data, setData] = useState<DataType[]>([]);

  const handleChange = (newData: DataType[]) => {
    console.log("🚀  newData:", newData);
    setData(newData);
  };

  return (
    <div>
      <ReactSyncTable
        tableName="DUMMY TABLE"
        schema={tableSchema}
        maxWidth={"1000px"}
        data={data}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
