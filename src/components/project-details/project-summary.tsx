import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types/project";
import type { Project } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSummaryProps {
  project: Project;
  transactions: Transaction[];
}

export default function ProjectSummary({
  project,
  transactions,
}: ProjectSummaryProps) {
  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by type
  const expensesByType = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const type = t.expenseType;
       if (type) {
         acc[type] = (acc[type] || 0) + t.amount;
       }
      return acc;
    }, {} as Record<string, number>);

  // Sort expense types by amount (highest first)
  const sortedExpenseTypes = Object.entries(expensesByType).sort(
    (a, b) => b[1] - a[1]
  );

  // Calculate percentages for expense types
  const expensePercentages = sortedExpenseTypes.map(([type, amount]) => ({
    type,
    amount,
    percentage: Math.round((amount / totalExpenses) * 100),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Income</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Total Expenses
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground">Net Balance</div>
              <div
                className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(totalIncome - totalExpenses)}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                Remaining from Final Quote
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(project.final_quotation - totalIncome)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-6 pr-4">
              {expensePercentages.map(({ type, amount, percentage }) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{type}</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(amount)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={percentage} className="h-2" />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}

              {expensePercentages.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No expense data available
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Reduction Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensePercentages.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Based on your expense breakdown, here are areas where you
                  might reduce costs:
                </p>
                <ul className="space-y-2">
                  {expensePercentages.slice(0, 2).map(({ type }) => (
                    <li key={type} className="text-sm">
                      <span className="font-medium">{type}:</span> This category
                      represents a significant portion of your expenses.
                      Consider negotiating with vendors or finding alternative
                      solutions.
                    </li>
                  ))}
                </ul>

                {project.site_status?.site_status_name === "Ongoing" && (
                  <p className="text-sm mt-4">
                    This project is still ongoing. Monitor these expense
                    categories closely to prevent cost overruns and maintain
                    profitability.
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No expense data available for analysis
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
