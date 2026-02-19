# Veriforge 🔥

A powerful, modern web application for automated bulk certificate generation with customizable templates, premium fonts, and QR verification codes.

## Features

- **Bulk Generation**: Process hundreds of certificates in seconds from CSV/Excel data
- **Custom Templates**: Support for PDF, PNG, and JPG certificate templates
- **Premium Fonts**: 21+ Google Fonts embedded directly in PDFs (Playfair Display, Cinzel, Montserrat, and more)
- **Visual Editor**: Intuitive drag-and-drop interface to position text elements on your template
- **Field Mapping**: Intelligent mapping between spreadsheet columns and certificate fields
- **QR Verification**: Optional QR codes for certificate authenticity verification
- **Full Customization**: Control over font family, size, color, and positioning for each field
- **WYSIWYG**: What you see in the preview is exactly what you get in the PDF
- **Export**: Download all certificates as a convenient ZIP file

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **PDF Generation**: pdf-lib + fontkit (for custom font embedding)
- **Data Processing**: xlsx (Excel/CSV parsing)
- **QR Codes**: qrcode library
- **Packaging**: JSZip

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone https://github.com/sarvessh05/Veriforge.git

# Navigate to project directory
cd Veriforge

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
- Choose from 21+ premium Google Fonts
- Customize font size and color for each field
- Enable/disable individual fields
- Add optional QR verification code
- Real-time preview with hover effects

### 4. Generate
- Click "Start Forging" to generate all certificates
- Fonts are automatically embedded in PDFs
- Download the ZIP file containing all PDFs

## Available Fonts

### Elegant Serif (Perfect for Names)
- Playfair Display, Cinzel, Cormorant Garamond
- Libre Baskerville, Merriweather, EB Garamond
- Crimson Text, Old Standard TT

### Modern Sans (Great for Event/Date)
- Montserrat, Poppins, Raleway, Lato
- Oswald, Roboto, Open Sans

### Script/Signature (Decorative Elements)
- Great Vibes, Allura, Dancing Script
- Pacifico, Sacramento

### Standard PDF Fonts (Fallback)
- Helvetica, Times New Roman, Courier

## Color Palette

Choose from 12 carefully selected colors:
- Black, White, Dark Navy, Gold
- Dark Red, Dark Blue, Indigo, Dark Slate
- Midnight Blue, Royal Brown, Burgundy, Goldenrod

## Data File Format

Your spreadsheet should contain columns for recipient information. Example:

| Name | Event | Date | Certificate ID |
|------|-------|------|----------------|
| John Doe | Web Development Course | 2024-01-15 | CERT-001 |
| Jane Smith | Data Science Workshop | 2024-01-15 | CERT-002 |

## Project Structure

```
Veriforge/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CertificateEditor.tsx
│   │   ├── FieldMapper.tsx
│   │   ├── FileUpload.tsx
│   │   └── GenerationProgress.tsx
│   ├── lib/
│   │   ├── certificate-engine.ts  # Core generation logic with font embedding
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Landing.tsx     # Landing page
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

## Key Features Explained

### Font Embedding
Veriforge uses `fontkit` to embed Google Fonts directly into PDFs. This means:
- No font substitution issues
- Recipients see exactly what you designed
- Works on any device without font installation
- Professional, consistent appearance

### Drag-and-Drop Editor
- Hover over elements to see interactive highlights
- Large hit areas for easy clicking
- Visual feedback during dragging
- Boundary constraints to keep elements on canvas
- Real-time position updates

### Smart Field Mapping
- Automatically detects spreadsheet columns
- Preview data before generation
- Flexible mapping for different data formats
- Support for optional fields

## Browser Compatibility

Veriforge works best on modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Fonts are cached after first load
- Efficient batch processing
- Progress tracking during generation
- Optimized for large datasets (100+ certificates)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

Created by [Sarvessh](https://github.com/sarvessh05)

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- PDF manipulation with [pdf-lib](https://pdf-lib.js.org/)
- Font embedding with [fontkit](https://github.com/foliojs/fontkit)
- Fonts from [Google Fonts](https://fonts.google.com/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/sarvessh05/Veriforge/issues) on GitHub.

---

Made with ❤️ for certificate automation
