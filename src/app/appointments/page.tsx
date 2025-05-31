
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
import { CalendarPlus, CalendarCheck2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Cancelled";
}

const mockAppointments: Appointment[] = [
  { id: "1", doctorName: "Dr. Emily Carter", specialty: "Cardiologist", date: "2024-08-15", time: "10:00 AM", status: "Upcoming" },
  { id: "2", doctorName: "Dr. John Smith", specialty: "Dermatologist", date: "2024-07-20", time: "02:30 PM", status: "Completed" },
  { id: "3", doctorName: "Dr. Sarah Lee", specialty: "Pediatrician", date: "2024-08-01", time: "11:00 AM", status: "Cancelled" },
  { id: "4", doctorName: "Dr. Michael Brown", specialty: "General Practitioner", date: "2024-09-01", time: "09:00 AM", status: "Upcoming" },
];


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleBookAppointment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAppointment: Appointment = {
      id: String(appointments.length + 1),
      doctorName: formData.get("doctorName") as string || "Dr. Placeholder",
      specialty: formData.get("specialty") as string || "General",
      date: newAppointmentDate ? format(newAppointmentDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: formData.get("time") as string || "10:00 AM",
      status: "Upcoming",
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setIsDialogOpen(false);
    event.currentTarget.reset();
    setNewAppointmentDate(new Date());
    toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${newAppointment.doctorName} on ${newAppointment.date} is confirmed.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-primary" />
            Manage Your Appointments
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            View upcoming and past appointments. Book new ones with ease.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" /> Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details below to schedule your appointment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBookAppointment} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctorName" className="text-right">
                  Doctor
                </Label>
                <Input id="doctorName" name="doctorName" defaultValue="Dr. Acula" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialty" className="text-right">
                  Specialty
                </Label>
                <Input id="specialty" name="specialty" defaultValue="Vampirism" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Popover>
                      <PopoverTrigger asChild>
                      <Button
                          variant={"outline"}
                          className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !newAppointmentDate && "text-muted-foreground"
                          )}
                      >
                          <CalendarCheck2 className="mr-2 h-4 w-4" />
                          {newAppointmentDate ? format(newAppointmentDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={newAppointmentDate}
                          onSelect={setNewAppointmentDate}
                          initialFocus
                      />
                      </PopoverContent>
                  </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input id="time" name="time" type="time" defaultValue="10:00" className="col-span-3" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Book Appointment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6">
        {appointments.length > 0 ? (
          <Table>
            <TableCaption>A list of your medical appointments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.specialty}</TableCell>
                  <TableCell>{format(new Date(appointment.date), "MMMM dd, yyyy")}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        appointment.status === "Upcoming" && "bg-blue-100 text-blue-700",
                        appointment.status === "Completed" && "bg-green-100 text-green-700",
                        appointment.status === "Cancelled" && "bg-red-100 text-red-700"
                      )}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
              <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no appointments scheduled.</p>
              <p className="text-sm text-muted-foreground">Click "Book New Appointment" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
