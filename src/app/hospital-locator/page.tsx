
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Search, Phone, Globe, Hourglass } from "lucide-react";
import Image from "next/image";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  hours: string;
  distance: string;
  services: string[];
  imageUrl?: string;
}

const mockHospitals: Hospital[] = [
  {
    id: "1",
    name: "City General Hospital",
    address: "123 Main St, Anytown, USA",
    phone: "555-1234",
    website: "citygeneral.org",
    hours: "24/7 Emergency",
    distance: "2.5 miles",
    services: ["Emergency Care", "Cardiology", "Pediatrics"],
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "2",
    name: "Community Health Clinic",
    address: "456 Oak Ave, Anytown, USA",
    phone: "555-5678",
    hours: "Mon-Fri 9 AM - 5 PM",
    distance: "1.8 miles",
    services: ["General Practice", "Vaccinations", "Minor Illnesses"],
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "3",
    name: "St. Luke's Medical Center",
    address: "789 Pine Rd, Anytown, USA",
    phone: "555-9012",
    website: "stlukes.com",
    hours: "24/7 Full Service",
    distance: "5.1 miles",
    services: ["Surgery", "Oncology", "Maternity"],
    imageUrl: "https://placehold.co/600x400.png",
  },
];

export default function HospitalLocatorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For privacy, we won't use actual coordinates, just simulate a known location
          setUserLocation("Your Current Area (Simulated)");
        },
        () => {
          setUserLocation("Unable to retrieve location");
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality to be implemented
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Find Nearby Hospitals & Clinics
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Search for healthcare facilities in your area. Map integration coming soon.
        </p>
      </div>
      
      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter address, zip code, or hospital name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>
        {userLocation && (
          <p className="text-sm text-muted-foreground mb-4">
            Searching near: {userLocation}
          </p>
        )}
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-6">
          <p className="text-foreground/70">Map Placeholder - Real map integration coming soon!</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {mockHospitals.map((hospital) => (
          <Card key={hospital.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            {hospital.imageUrl && (
               <div className="relative w-full h-48">
                 <Image src={hospital.imageUrl} alt={hospital.name} layout="fill" objectFit="cover" className="rounded-t-md" data-ai-hint="hospital building" />
               </div>
            )}
            <CardHeader>
              <CardTitle>{hospital.name}</CardTitle>
              <CardDescription>{hospital.address}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-primary" /> {hospital.phone}</p>
                {hospital.website && <p className="flex items-center"><Globe className="mr-2 h-4 w-4 text-primary" /> <a href={`https://${hospital.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{hospital.website}</a></p>}
                <p className="flex items-center"><Hourglass className="mr-2 h-4 w-4 text-primary" /> {hospital.hours}</p>
                <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" /> {hospital.distance}</p>
                <div>
                  <h4 className="font-semibold mt-2">Services:</h4>
                  <ul className="list-disc list-inside text-xs">
                    {hospital.services.map(service => <li key={service}>{service}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
