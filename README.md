# React Sync Table

A powerful React component library for creating synchronized, editable tables with built-in form controls. Perfect for building dynamic data entry forms, CRUD interfaces, and data management tables.

## Demo

![react-sync-table](https://github.com/user-attachments/assets/a55a1a6b-fe8e-45af-8059-018935845e6b)

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

## Step-by-Step Guide

### 1. Define Your Data Structure

First, define a TypeScript interface or type for your table data:

```tsx
type ProductData = {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};
```

### 2. Create Your Table Schema

Define how each column should behave using the `SchemaItem` interface:

```tsx
const productSchema: SchemaItem[] = [
  {
    headerKey: "name",
    headerName: "Product Name",
    type: "text",
    width: "30%",
  },
  {
    headerKey: "price",
    headerName: "Price",
    type: "number",
    width: "20%",
  },
  {
    headerKey: "category",
    headerName: "Category",
    type: "dropdown",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Books", value: "books" },
    ],
    width: "25%",
  },
  {
    headerKey: "inStock",
    headerName: "Stock Status",
    type: "display", // Read-only display
    width: "15%",
  },
];
```

### 3. Handle Data Changes

The table component provides real-time updates through the `onChange` callback:

```tsx
function ProductTable() {
  const [products, setProducts] = useState<ProductData[]>([]);

  const handleDataChange = (newData: ProductData[]) => {
    // Update local state
    setProducts(newData);

    // You can also sync with your backend here
    // await saveToDatabase(newData);
  };

  return (
    <ReactSyncTable
      schema={productSchema}
      data={products}
      onChange={handleDataChange}
    />
  );
}
```

### 4. Add Validation (Optional)

You can add validation by providing error states:

```tsx
function ProductTableWithValidation() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [errors, setErrors] = useState<Array<Record<string, string>>>([]);

  const validateData = (data: ProductData[]) => {
    const newErrors = data.map((product) => {
      const rowErrors: Record<string, string> = {};

      if (!product.name) {
        rowErrors.name = "Name is required";
      }
      if (product.price < 0) {
        rowErrors.price = "Price cannot be negative";
      }

      return rowErrors;
    });

    setErrors(newErrors);
    return newErrors.every((errors) => Object.keys(errors).length === 0);
  };

  const handleDataChange = (newData: ProductData[]) => {
    if (validateData(newData)) {
      setProducts(newData);
    }
  };

  return (
    <ReactSyncTable
      schema={productSchema}
      data={products}
      onChange={handleDataChange}
      errors={errors}
      hasError={errors.some((row) => Object.keys(row).length > 0)}
    />
  );
}
```

## Available Input Types

The table supports several input types to handle different data needs:

1. **text**: For string input

   ```tsx
   {
     headerKey: "description",
     headerName: "Description",
     type: "text",
     width: "40%"
   }
   ```

2. **number**: For numeric values

   ```tsx
   {
     headerKey: "quantity",
     headerName: "Quantity",
     type: "number",
     width: "20%"
   }
   ```

3. **dropdown**: For selection from predefined options

   ```tsx
   {
     headerKey: "status",
     headerName: "Status",
     type: "dropdown",
     options: [
       { label: "Active", value: "active" },
       { label: "Inactive", value: "inactive" }
     ],
     closeOnSelection: true, // Optional: closes dropdown after selection
     width: "20%"
   }
   ```

4. **duration**: For time-based inputs

   ```tsx
   {
     headerKey: "duration",
     headerName: "Duration",
     type: "duration",
     width: "20%"
   }
   ```

5. **display**: For read-only fields
   ```tsx
   {
     headerKey: "id",
     headerName: "ID",
     type: "display",
     width: "10%"
   }
   ```

## Component Props

| Prop | Type | Required | Description |
| --------- | ----------------------------- | -------- | ---------------------------------------------- | |
| schema | SchemaItem[] | Yes | Array of column configurations |
| data | T[] | Yes | Array of objects containing the table data |
| onChange | (data: T[]) => void | Yes | Callback function when data changes |
| errors | Array<Record<string, string>> | No | Validation errors for each cell |
| hasError | boolean | No | Indicates if the table has validation errors |
| maxWidth | string | No | Maximum width of the table (default: "1000px") |

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

## Best Practices

1. **Type Safety**: Always define your data types using TypeScript interfaces
2. **Schema Organization**: Keep your schema definitions in a separate file for better maintainability
3. **Validation**: Implement validation logic before updating your data
4. **Error Handling**: Use the error props to provide feedback to users
5. **Responsive Design**: Set appropriate column widths using the `width` property
6. **Performance**: For large datasets, consider implementing pagination or virtualization

## Common Use Cases

### 1. Data Entry Form

```tsx
const formSchema: SchemaItem[] = [
  {
    headerKey: "firstName",
    headerName: "First Name",
    type: "text",
    width: "30%",
  },
  {
    headerKey: "lastName",
    headerName: "Last Name",
    type: "text",
    width: "30%",
  },
  {
    headerKey: "email",
    headerName: "Email",
    type: "text",
    width: "40%",
  },
];
```

### 2. Inventory Management

```tsx
const inventorySchema: SchemaItem[] = [
  {
    headerKey: "productId",
    headerName: "Product ID",
    type: "display",
    width: "15%",
  },
  {
    headerKey: "name",
    headerName: "Product Name",
    type: "text",
    width: "30%",
  },
  {
    headerKey: "quantity",
    headerName: "Quantity",
    type: "number",
    width: "15%",
  },
  {
    headerKey: "category",
    headerName: "Category",
    type: "dropdown",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
    width: "20%",
  },
  {
    headerKey: "status",
    headerName: "Status",
    type: "dropdown",
    options: [
      { label: "In Stock", value: "in_stock" },
      { label: "Low Stock", value: "low_stock" },
      { label: "Out of Stock", value: "out_of_stock" },
    ],
    width: "20%",
  },
];
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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
