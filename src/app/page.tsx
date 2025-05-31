
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, Activity, Brain, CalendarClock, Pill, Hospital, FileSearchIcon, LineChart as LineChartIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockStepsData = [
  { date: "Mon", steps: 7500 },
  { date: "Tue", steps: 8200 },
  { date: "Wed", steps: 6800 },
  { date: "Thu", steps: 9100 },
  { date: "Fri", steps: 7800 },
  { date: "Sat", steps: 10500 },
  { date: "Sun", steps: 7200 },
];

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function DashboardPage() {
  const cardHoverEffect = "hover:border-primary hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out";

  return (
    <div className="space-y-8">
      {/* Personalized Insights - Full Width */}
      <Card className={`shadow-lg ${cardHoverEffect} w-full`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Personalized Insights</CardTitle>
          <Brain className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Maintain your current activity level for optimal heart health. Consider adding more leafy greens to your diet.
          </p>
          <Link href="/health-advisor" passHref>
            <Button variant="link" className="p-0 mt-3 text-sm">Get AI Health Advice</Button>
          </Link>
        </CardContent>
      </Card>

      {/* 2-Column Grid for Metrics, Appointments, Medications, Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`shadow-lg ${cardHoverEffect}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Key Health Metrics
            </CardTitle>
            <Activity className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">
              Based on your recent activity
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Heart Rate:</span> <span className="font-semibold">72 bpm</span></div>
              <div className="flex justify-between"><span>Sleep:</span> <span className="font-semibold">7h 45m</span></div>
              <div className="flex justify-between"><span>Steps:</span> <span className="font-semibold">8,230</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-lg ${cardHoverEffect}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Appointments
            </CardTitle>
            <CalendarClock className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Upcoming</div>
            <p className="text-xs text-muted-foreground">
              Manage your schedule
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Dr. Smith - Annual Checkup - Tomorrow, 10:00 AM</li>
              <li>Dental Cleaning - Next Week, 2:30 PM</li>
            </ul>
            <Link href="/appointments" passHref>
              <Button variant="outline" size="sm" className="mt-4 w-full">View All Appointments</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className={`shadow-lg ${cardHoverEffect}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Medication Reminders</CardTitle>
            <Pill className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Stay on top of your medication schedule.</p>
            <ul className="mt-4 space-y-2 text-sm">
                <li>Vitamin D - Daily at 9:00 AM</li>
                <li>Allergy Relief - As needed</li>
            </ul>
            <Link href="/medications" passHref>
                <Button variant="outline" size="sm" className="mt-4 w-full">Manage Medications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className={`shadow-lg ${cardHoverEffect}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <ListChecks className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/symptom-analyzer" passHref>
              <Button className="w-full" variant="default">
                <FileSearchIcon className="mr-2 h-4 w-4" /> Analyze Symptoms
              </Button>
            </Link>
            <Link href="/hospital-locator" passHref>
              <Button className="w-full" variant="secondary">
                <Hospital className="mr-2 h-4 w-4" /> Find Nearby Hospitals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Your Health Journey - Full Width */}
      <Card className={`shadow-lg ${cardHoverEffect} w-full`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Your Health Journey</CardTitle>
            <LineChartIcon className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
            <CardDescription className="mb-4">Steps taken over the last 7 days.</CardDescription>
          <div className="aspect-video w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockStepsData}
                  margin={{
                    top: 5,
                    right: 20, // Adjusted for better label visibility
                    left: 0,  // Adjusted for better label visibility
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideIndicator />}
                  />
                  <Line
                    dataKey="steps"
                    type="monotone"
                    stroke="var(--color-steps)"
                    strokeWidth={2}
                    dot={true}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
