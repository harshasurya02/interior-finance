import {
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { Project } from "@/types/project";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const {
    site_name,
    initial_quotation,
    final_quotation,
    site_status,
    incoming,
    // amountReceived,
    expenses,
  } = project;

  const profitLoss = incoming - expenses;
  const isProfitable = profitLoss >= 0;
  const progressPercentage = Math.min(
    100,
    Math.round((incoming / final_quotation) * 100)
  );

  return (
    // <Link href={`/projects/${project.id}`}>
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{site_name}</CardTitle>
          <Badge
            variant={
              site_status.site_status_name === "Ongoing"
                ? "secondary"
                : "default"
            }
          >
            {site_status.site_status_name === "Ongoing" ? (
              <ClockIcon className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircleIcon className="h-3 w-3 mr-1" />
            )}
            {site_status.site_status_name}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  // return null;
                  onEdit(project);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Initial Quote</p>
              <p className="font-medium">{formatCurrency(initial_quotation)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Final Quote</p>
              <p className="font-medium">{formatCurrency(final_quotation)}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm text-muted-foreground">Amount Received</p>
              <p className="text-sm font-medium">{formatCurrency(incoming)}</p>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercentage}% of final quote
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="font-medium">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Profit/Loss</p>
            <div
              className={`flex items-center font-bold ${
                isProfitable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isProfitable ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {formatCurrency(Math.abs(profitLoss))}
            </div>
          </div>
          <br />
          <Link href={`/projects/${project.id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
    // </Link>
  );
}
