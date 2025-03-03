import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { ClockIcon, CheckCircleIcon } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const {
    site_name,
    initial_quotation,
    final_quotation,
    site_status,
    incoming,
    expenses,
  } = project;

  const profitLoss = incoming - expenses;
  const isProfitable = profitLoss >= 0;
  const progressPercentage = Math.min(
    100,
    Math.round((incoming / final_quotation) * 100)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{site_name}</h1>
          <div className="flex items-center mt-2">
            <Badge
              variant={
                project.site_status.site_status_name === "Ongoing"
                  ? "secondary"
                  : "default"
              }
              className="text-sm"
            >
              {project.site_status.site_status_name === "Ongoing" ? (
                <ClockIcon className="h-3 w-3 mr-1" />
              ) : (
                <CheckCircleIcon className="h-3 w-3 mr-1" />
              )}
              {project.site_status.site_status_name}
            </Badge>
          </div>
        </div>

        <div
          className={`text-xl font-bold ${
            isProfitable ? "text-green-600" : "text-red-600"
          }`}
        >
          {isProfitable ? "Profit: " : "Loss: "}
          {formatCurrency(Math.abs(profitLoss))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Initial Quotation
            </div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(initial_quotation)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Final Quotation</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(final_quotation)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-1">
              <div className="text-sm text-muted-foreground">
                Amount Received
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(incoming)}
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {progressPercentage}% of final quote
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
