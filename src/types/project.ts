export interface Project {
  id: any;
  site_name: any;
  expenses: any;
  incoming: any;
  initial_quotation: any;
  final_quotation: any;
  site_status: any;
}

export interface SiteStatus {
  site_status_name: any;
}

export interface Transaction {
  id: string;
  // projectId: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string;
  remarks?: string;
  expenseType?: string;
}

export interface Expense {
  id: any;
  remarks: any;
  expenses_type: {
    expenses_type_name: any;
  };
  site: {
    site_name: any;
  };
  amount: any;
  created_at: any;
}

export interface Incoming {
  id: any;
  remarks: any;
  site: {
    // site_id: any;
    site_name: any;
  };
  created_at: any;
  amount: any;
}
[];
