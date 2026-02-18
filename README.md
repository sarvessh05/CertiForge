# CertiForge 🔥

A powerful, modern web application for automated bulk certificate generation with customizable templates and QR verification codes.

## Features

- **Bulk Generation**: Process hundreds of certificates in seconds from CSV/Excel data
- **Custom Templates**: Support for PDF, PNG, and JPG certificate templates
- **Visual Editor**: Drag-and-drop interface to position text elements on your template
- **Field Mapping**: Intelligent mapping between spreadsheet columns and certificate fields
- **QR Verification**: Optional QR codes for certificate authenticity verification
- **Customization**: Full control over font sizes, colors, and positioning
- **Export**: Download all certificates as a convenient ZIP file

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **PDF Generation**: pdf-lib
- **Data Processing**: xlsx (Excel/CSV parsing)
- **QR Codes**: qrcode library
- **Packaging**: JSZip

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone https://github.com/sarvessh05/CertiForge.git

# Navigate to project directory
cd CertiForge

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Usage

### 1. Upload Files
- Upload your certificate template (PDF, PNG, or JPG)
- Upload your data file (CSV, XLSX, or XLS) containing recipient information

### 2. Map Fields
- Match spreadsheet columns to certificate fields
- Required: Name field mapping
- Optional: Event, Date, Certificate ID fields

### 3. Design Layout
- Drag text elements to position them on your template
- Customize font size and color for each field
- Enable/disable individual fields
- Add optional QR verification code

### 4. Generate
- Click "Start Forging" to generate all certificates
- Download the ZIP file containing all PDFs

## Data File Format

Your spreadsheet should contain columns for recipient information. Example:

| Name | Event | Date | Certificate ID |
|------|-------|------|----------------|
| John Doe | Web Development Course | 2024-01-15 | CERT-001 |
| Jane Smith | Data Science Workshop | 2024-01-15 | CERT-002 |

## Project Structure

```
CertiForge/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CertificateEditor.tsx
│   │   ├── FieldMapper.tsx
│   │   ├── FileUpload.tsx
│   │   └── GenerationProgress.tsx
│   ├── lib/
│   │   ├── certificate-engine.ts  # Core generation logic
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx       # Main application page
│   │   └── NotFound.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Created by [Sarvessh](https://github.com/sarvessh05)

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- PDF manipulation with [pdf-lib](https://pdf-lib.js.org/)
