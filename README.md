# React Sync Table

A React component library for creating synchronized, editable tables with built-in form controls and responsive design.

## Installation

```bash
npm install react-sync-table
# or
yarn add react-sync-table
# or
pnpm add react-sync-table
```

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@mui/material": "^5.0.0",
  "react-select": "^5.0.0"
}
```

## Usage

```tsx
import { ReactSyncTable } from "react-sync-table";

function App() {
  const handleDataChange = (newData) => {
    console.log("Table data changed:", newData);
  };

  return (
    <ReactSyncTable
      data={[
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
      ]}
      columns={[
        { field: "name", headerName: "Name", type: "text" },
        { field: "age", headerName: "Age", type: "number" },
      ]}
      onChange={handleDataChange}
    />
  );
}
```

## Features

- 📱 Responsive design that works on mobile and desktop
- ✏️ Built-in form controls (text, number, select, duration)
- 🔄 Real-time data synchronization
- 🎨 Customizable styling
- 📊 Support for different data types
- 🔍 Input validation
- ♿ Accessibility support

## Component Props

### ReactSyncTable

| Prop       | Type     | Required | Description                                |
| ---------- | -------- | -------- | ------------------------------------------ |
| data       | Array    | Yes      | Array of objects containing the table data |
| columns    | Array    | Yes      | Array of column configurations             |
| onChange   | Function | Yes      | Callback function when data changes        |
| disabled   | boolean  | No       | Disables all table interactions            |
| borderless | boolean  | No       | Removes borders from inputs                |
| className  | string   | No       | Additional CSS class name                  |

### Column Configuration

```typescript
interface Column {
  field: string; // Field name in data object
  headerName: string; // Column header text
  type: "text" | "number" | "select" | "duration"; // Input type
  options?: Array<{
    // Required for select type
    label: string;
    value: any;
  }>;
  disabled?: boolean; // Disable editing for this column
  required?: boolean; // Make this field required
  validation?: {
    // Custom validation rules
    pattern?: RegExp;
    message?: string;
  };
}
```

## Publishing Updates

To publish a new version of the package:

1. Update the version in `package.json`:

   ```bash
   npm version patch  # for bug fixes (0.0.x)
   npm version minor  # for new features (0.x.0)
   npm version major  # for breaking changes (x.0.0)
   ```

2. Build the package:

   ```bash
   npm run build
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

Note: Make sure you're logged in to npm (`npm login`) and have the necessary permissions to publish to the package.

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
