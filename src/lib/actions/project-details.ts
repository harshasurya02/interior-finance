// @ts-nocheck
import { createClient } from "../supabase/server";
import { Transaction, Expense, Incoming, Project } from "@/types/project"; // Assuming you have these types defined

export async function getExpenses(site_id: string): Promise<Expense[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(
      "id, remarks, expenses_type(expenses_type_name), site(site_name), created_at, amount"
    )
    .eq("site_id", site_id);
  console.log(data);
  if (error) {
    console.error("Error fetching expenses:", error);
    return null;
  }

  return data;
}

export async function getAmountReceived(
  site_id: string
): Promise<Incoming[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incoming")
    .select("id, remarks, site(site_name), created_at, amount")
    .eq("site_id", site_id);

  if (error) {
    console.error("Error fetching amounts received:", error);
    return null;
  }

  return data;
}

export function mapTransactions(
  amountReceived: Incoming[] | null,
  expenses: Expense[] | null
): Transaction[] {
  const incomeTransactions: Transaction[] =
    amountReceived?.map((entry) => ({
      id: entry.id,
      // projectId: entry.site[0].site_id,
      type: "income",
      amount: entry.amount,
      date: entry.created_at,
      description: `Income from ${entry.site.site_name}`,
      remarks: entry.remarks,
    })) || [];

  const expenseTransactions: Transaction[] =
    expenses?.map((entry) => ({
      id: entry.id,
      // projectId: entry.site[0].site_id,
      type: "expense",
      amount: entry.amount || 0, // Assuming amount might be missing, default to 0
      date: entry.created_at,
      description: `Expense for ${entry.site.site_name}`,
      remarks: entry.remarks,
      expenseType: entry.expenses_type.expenses_type_name,
    })) || [];

  // Combine income and expense transactions
  const allTransactions = [...incomeTransactions, ...expenseTransactions];

  // Sort transactions by createdAt (latest first)
  return allTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getProjectTransactions(
  site_id: string
): Promise<Transaction[]> {
  const [expenses, amountsReceived] = await Promise.all([
    getExpenses(site_id),
    getAmountReceived(site_id),
  ]);
  if (!expenses) {
    console.log(expenses);
    return [];
  }
  if (!amountsReceived) {
    console.log(amountsReceived);
    return [];
  }

  return mapTransactions(amountsReceived, expenses);
}

export async function getProjectDetails(id: string) {
  const supabase = await createClient();
  const project = await supabase
    .from("site")
    .select(
      `id, site_name, expenses, incoming, initial_quotation, final_quotation, site_status(site_status_name)`
    )
    .eq("id", id)
    .returns<Project[]>();

  return project.data?.[0];
}
