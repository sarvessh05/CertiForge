import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface FieldMapperProps {
  columns: string[];
  previewData: Record<string, string>[];
  mapping: Record<string, string>;
  onMappingChange: (field: string, column: string) => void;
}

const FIELDS = [
  { key: "name", label: "Recipient Name", required: true },
  { key: "event", label: "Event / Course", required: false },
  { key: "date", label: "Date", required: false },
  { key: "id", label: "Certificate ID", required: false },
];

const FieldMapper = ({ columns, previewData, mapping, onMappingChange }: FieldMapperProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {field.label}
              {field.required && <span className="ml-1 text-primary">*</span>}
            </Label>
            <Select
              value={mapping[field.key] || ""}
              onValueChange={(val) => onMappingChange(field.key, val)}
            >
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select column..." />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {previewData.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Data Preview (first 5 rows)
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead key={col} className="font-mono text-xs text-primary whitespace-nowrap">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 5).map((row, i) => (
                  <TableRow key={i} className="border-border">
                    {columns.map((col) => (
                      <TableCell key={col} className="text-sm text-foreground whitespace-nowrap">
                        {String(row[col] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldMapper;
