
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { FileText, PlusCircle, Download, Eye, Info, UploadCloud, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MedicalRecord {
  id: string;
  name: string;
  type: string; 
  date: string;
  fileName?: string; 
}

const mockMedicalRecords: MedicalRecord[] = [
  { id: "1", name: "Annual Blood Test Results", type: "Lab Report", date: "2024-05-10", fileName: "lab_report_20240510.pdf" },
  { id: "2", name: "Chest X-Ray Report", type: "X-Ray", date: "2024-03-22", fileName: "xray_chest_20240322.dicom" },
  { id: "3", name: "Prescription for Amoxicillin", type: "Prescription", date: "2024-06-01", fileName: "rx_amox_20240601.jpg" },
];

const recordTypes = ["Lab Report", "X-Ray", "Prescription", "Doctor's Note", "Vaccination Record", "Imaging Result", "Discharge Summary", "Other"];

export default function MedicalRecordsPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecordDate, setNewRecordDate] = useState<Date | undefined>(new Date());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAddRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRecord: MedicalRecord = {
      id: String(medicalRecords.length + 1),
      name: formData.get("recordName") as string || "Untitled Record",
      type: formData.get("recordType") as string || "Other",
      date: newRecordDate ? format(newRecordDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      fileName: selectedFile ? selectedFile.name : "N/A",
    };
    setMedicalRecords(prev => [newRecord, ...prev]);
    setIsDialogOpen(false);
    setSelectedFile(null);
    event.currentTarget.reset();
    setNewRecordDate(new Date());

    toast({
        title: "Medical Record Added",
        description: `${newRecord.name} has been added to your records.`,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Medical Records
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your medical documents, reports, and images.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Record
            </Button>            
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Medical Record</DialogTitle>
              <DialogDescription>
                Fill in the details and upload your medical document.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recordName" className="text-right">Name</Label>
                <Input id="recordName" name="recordName" placeholder="e.g., Annual Checkup Report" className="col-span-3" required />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recordType" className="text-right">Type</Label>
                <Select name="recordType" defaultValue="Other" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recordDate" className="text-right">Date</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          variant={"outline"}
                          className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newRecordDate && "text-muted-foreground"
                          )}
                      >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newRecordDate ? format(newRecordDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={newRecordDate}
                          onSelect={setNewRecordDate}
                          initialFocus
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                      </PopoverContent>
                  </Popover>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="recordFile" className="text-right pt-2">File</Label>
                  <div className="col-span-3">
                      <Input id="recordFile" name="recordFile" type="file" onChange={handleFileChange} className="pt-1.5" />
                      {selectedFile && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
                      {!selectedFile && <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. (Demo only)</p>}
                  </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={() => { setSelectedFile(null); setNewRecordDate(new Date()); const formElement = event.currentTarget as HTMLFormElement | null; if (formElement) formElement.reset(); }}>Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  <UploadCloud className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6">
        {medicalRecords.length > 0 ? (
          <Table>
            <TableCaption>A list of your medical records. File upload is for demo purposes only.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Record Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{format(new Date(record.date), "MMMM dd, yyyy")}</TableCell>
                  <TableCell className="text-xs truncate max-w-xs">{record.fileName || "N/A"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => toast({ title: "View Record", description: `Viewing '${record.name}' (Mock).`})} aria-label="View record">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast({ title: "Download Record", description: `Downloading '${record.fileName}' (Mock).`})} aria-label="Download record">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
           <div className="text-center py-10">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no medical records stored.</p>
              <p className="text-sm text-muted-foreground">Click "Add New Record" to upload your first document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
