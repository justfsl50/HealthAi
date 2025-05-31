
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pill, PlusCircle, BellRing, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  reminderActive: boolean;
}

const mockMedications: Medication[] = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", notes: "Take in the morning with food.", reminderActive: true },
  { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", notes: "Take with breakfast and dinner.", reminderActive: true },
  { id: "3", name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", reminderActive: false },
  { id: "4", name: "Amoxicillin", dosage: "250mg", frequency: "Every 8 hours for 7 days", notes: "Finish entire course.", reminderActive: true },
];

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddMedication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newMedication: Medication = {
      id: String(medications.length + 1),
      name: formData.get("medicationName") as string || "Unnamed Medication",
      dosage: formData.get("dosage") as string || "N/A",
      frequency: formData.get("frequency") as string || "As directed",
      notes: formData.get("notes") as string || "",
      reminderActive: formData.get("reminder") === "on",
    };
    setMedications(prev => [newMedication, ...prev]);
    setIsDialogOpen(false);
    event.currentTarget.reset();
    toast({
        title: "Medication Added",
        description: `${newMedication.name} has been added to your list.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            Medication Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Keep track of your medications and set reminders.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your new medication below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMedication} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="medicationName" className="text-right">Name</Label>
                <Input id="medicationName" name="medicationName" placeholder="e.g., Ibuprofen" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">Dosage</Label>
                <Input id="dosage" name="dosage" placeholder="e.g., 200mg" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">Frequency</Label>
                <Input id="frequency" name="frequency" placeholder="e.g., Twice daily" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="e.g., Take with food" className="col-span-3" rows={3} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reminder" className="text-right">Reminder</Label>
                  <Input id="reminder" name="reminder" type="checkbox" className="col-span-1 h-5 w-5 justify-self-start" defaultChecked />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Medication</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6">
        {medications.length > 0 ? (
          <Table>
            <TableCaption>Your current list of medications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-center">Reminder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{med.notes || "-"}</TableCell>
                  <TableCell className="text-center">
                    {med.reminderActive ? (
                      <BellRing className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <BellRing className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
           <div className="text-center py-10">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no medications listed.</p>
              <p className="text-sm text-muted-foreground">Click "Add New Medication" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
