# React Sync Table

A Powerful React component library that streamlines data entry with auto-expanding rows and contextual input handling.

## Demo

![react-sync-table](https://github.com/user-attachments/assets/a55a1a6b-fe8e-45af-8059-018935845e6b)

## 🚀 Features

### 1. Auto-Add Empty Rows

- A new empty row is automatically added at the bottom **when the user starts typing** in any input field.
- Empty rows are **not saved** in the data until filled, reducing manual effort to add rows.

### 2. Smart Dropdown Behavior

- Dropdowns in a row **only open when the user focuses/clicks** on that specific row’s input.
- All dropdowns close automatically when the user clicks **outside the table**, ensuring a clean UI.

### 3. Input Type Support

- Supports **dropdown**, **text**, **number**, and **date** inputs. Configure column types easily.

### 4. Row Deletion

- Users can **delete any row** (except the auto-added empty row) to manage data flexibly.

### 5. Minimalist Design

- Built to **reduce form fatigue**—focuses on quick data entry with intuitive interactions.

## Basic Usage

Here's a simple example to get you started:

```tsx
import { ReactSyncTable } from "react-sync-table";
import type { SchemaItem } from "react-sync-table";
import { useState } from "react";

// 1. Define your data type
type UserData = {
  name: string;
  age: number;
  country: string;
};

// 2. Create your table schema
const userTableSchema: SchemaItem[] = [
  {
    headerKey: "name",
    headerName: "Full Name",
    type: "text",
    width: "30%",
  },
  {
    headerKey: "age",
    headerName: "Age",
    type: "number",
    width: "20%",
  },
  {
    headerKey: "country",
    headerName: "Country",
    type: "dropdown",
    options: [
      { label: "USA", value: "USA" },
      { label: "Canada", value: "CAN" },
      { label: "UK", value: "UK" },
    ],
    width: "30%",
  },
];

// 3. Create your component
function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);

  const handleDataChange = (newData: UserData[]) => {
    console.log("Updated users:", newData);
    setUsers(newData);
  };

  return (
    <ReactSyncTable
      schema={userTableSchema}
      data={users}
      onChange={handleDataChange}
      maxWidth="800px"
    />
  );
}
```

## Component Props

| Prop     | Type                  | Required | Description                                    |
| -------- | --------------------- | -------- | ---------------------------------------------- |
| schema   | `SchemaItem[]`        | Yes      | Array of column configurations                 |
| data     | `T[]`                 | Yes      | Array of objects containing the table data     |
| onChange | `(data: T[]) => void` | Yes      | Callback function when data changes            |
| maxWidth | `string`              | No       | Maximum width of the table (default: "1000px") |

## SchemaItem Configuration

```typescript
interface SchemaItem {
  headerKey: string; // Field name in data object
  headerName: string; // Column headerKey text
  type: "display" | "dropdown" | "text" | "duration" | "number"; // Input type
  width?: string; // Column width (e.g. "20%")
  options?: Array<{
    // Required for dropdown type
    label: string;
    value: string;
  }>;
  closeOnSelection?: boolean; // Close dropdown after selection
  setRespectiveDetail?: string[]; // Additional fields to update
}
```

## Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/react-sync-table.git
   cd react-sync-table
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build the package:
   ```bash
   npm run build
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
