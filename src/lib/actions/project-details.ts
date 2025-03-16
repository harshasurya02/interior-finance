"use server";
import { createClient } from "../supabase/server";
import { Transaction, Expense, Incoming, Project } from "@/types/project";

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

  return data as any[];
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

  return data as any[];
}

export async function mapTransactions(
  amountReceived: Incoming[] | null,
  expenses: Expense[] | null
): Promise<Transaction[]> {
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

export async function getExpenseTypeOptions() {
  const supabase = await createClient();

  const expenseTypeOptions = await supabase
    .from("expenses_type")
    .select("id, expenses_type_name");

  return expenseTypeOptions.data || [];
}

export async function addIncome(formData: {
  projectId: string;
  amount: number;
  // date: string;
  // description: string;
  remarks?: string;
}) {
  const supabase = await createClient();

  try {
    // Insert the expense into the database
    const { data, error } = await supabase
      .from("incoming")
      .insert([
        {
          site_id: formData.projectId,
          amount: formData.amount,
          // expenses_type_id: formData.expenseType,
          remarks: formData.remarks,
        },
      ])
      .select();

    // Check for errors from Supabase
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Log the inserted data for debugging
    console.log("Expense added successfully:", data);

    // Return the inserted data
    return data;
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error adding income:", err);

    // Re-throw the error to allow the caller to handle it
    throw new Error(
      `Failed to add income: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
}

export async function addExpense(formData: {
  projectId: string;
  amount: number;
  remarks?: string;
  expenseType: string;
}) {
  const supabase = await createClient();

  try {
    // Insert the expense into the database
    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          site_id: formData.projectId,
          amount: formData.amount,
          expense_type_id: formData.expenseType,
          remarks: formData.remarks,
        },
      ])
      .select();

    // Check for errors from Supabase
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Log the inserted data for debugging
    console.log("Expense added successfully:", data);

    // Return the inserted data
    return data;
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error adding expense:", err);

    // Re-throw the error to allow the caller to handle it
    throw new Error(
      `Failed to add expense: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
}
// export async function editProject(
//   project: ProjectInsertion,
//   projectId: string
// ) {
//   const supabase = await createClient();
//   const userId = (await supabase.auth.getUser()).data.user?.id;

//   if (!userId) {
//     return { error: "User ID is undefined. User might not be logged in." };
//   }

//   try {
//     const { data, error } = await supabase
//       .from("site")
//       .update({
//         site_name: project.site_name,
//         initial_quotation: project.initial_quotation,
//         final_quotation: project.final_quotation,
//         site_status_id: project.site_status_id,
//         user_id: userId,
//       })
//       .eq("id", projectId)
//       .select();

//     if (error) {
//       return { error: error.message };
//     }

//     return { data };
//   } catch (error) {
//     console.error("An error occurred while editing the project:", error);
//     return { error: "An unexpected error occurred. Please try again." };
//   }
// }