export interface HomeFilter {
    // branchCode?: string;
    // year?: number;
}

export interface DepositFilter {
    branchCode?: string;
    productCode?: string;
    schemeCode?: string;
    customerCategory?: string;
    accountStatus?: string;
    gender?: string;
    year?: number;
    month?: number;
}

export interface LoanFilter {
    branchCode?: string;
    schemeCode?: string;
    purpose?: string;
    segment?: string;
    prioritySector?: string;
    secureType?: string;
    accountStatus?: string;
    year?: number;
    month?: number;
}

export interface MonthlyTrendFilter {
    year?: number;
    month?: number;
}

export interface SummaryFilter {
    branchCode?: string;
}

export interface HomeKpi {
    totalLoanAccounts: number;
    totalLoanCustomers: number;
    totalLoanOutstanding: number;
    avgLoanInterest: number;
    totalDepositAccounts: number;
    totalDepositCustomers: number;
    totalDepositBalance: number;
    avgDepositInterest: number;
    activeLoanAccounts: number;
    activeDepositAccounts: number;
    // branchCode?: string;
    // year?: number;
}

export interface DepositAnalysis {
    branchCode?: string;
    productCode?: string;
    schemeCode?: string;
    customerCategory?: string;
    accountStatus?: string;
    customerGender?: string;
    accountCount?: number;
    totalBalance?: number;
    totalDepositAmount?: number;
    avgInterestRate?: number;
    openYear?: number;
    openMonth?: number;
}

export interface LoanAnalysis {
    branchCode?: string;
    loanSchemeCode?: string;
    purpose?: string;
    prioritySector?: string;
    segment?: string;
    secureUnsecure?: string;
    accountStatus?: string;
    loanCount?: number;
    totalSanctionAmount?: number;
    totalOutstanding?: number;
    totalOverdueAmount?: number;
    avgInterestRate?: number;
    disbursementYear?: number;
    disbursementMonth?: number;
}

export interface MonthlyTrend {
    year?: number;
    month?: number;
    totalLoanAmount?: number;
    totalDepositAmount?: number;
    netPosition?: number;
    loanDepositRatio?: number;
}

export interface BankingSummary {
    branchCode?: string;
    totalLoanAccounts?: number;
    totalLoanAmount?: number;
    totalDepositAccounts?: number;
    totalDepositAmount?: number;
    netPosition?: number;
    loanDepositRatio?: number;
}


export interface HomeCustomerSummary {
    totalDepositCustomers: number;
    totalLoanCustomers: number;
    totalCustomers: number;
    npaCustomers: number;
}

export interface AvailableDate {
    date: string;  //YYYY-MM-DD format
}


export interface DepositOpeningSummary {
    totalDepositOpenLast30Days: number;
    totalDepositAccountInBank: number;
    totalDepositAmount: number;
    openingPercentage: number;
}


export interface NPASummary {
    totalNPAOpenLast30Days: number;
    totalNPAAccountInBank: number;
    totalNPAAmount: number;
    openingPercentage: number;
}


export interface HCDistribution {
    count: number;
    hc: string;
}


export interface CASASummary {
    deposit_Type: string;
    total_Balance: number;
    cnt: number;
}


export interface GLDashboardSummary {
    total_Assets: number;
    total_Liabilities: number;
    total_Income: number;
    total_Expense: number;
    total_Debit: number;
    total_Credit: number;
    net_Profit: number;
    net_Position: number;
}


export interface PortfolioOverview {
    total_Deposit: number;
    total_Loan: number;
    net_Position: number;
    loan_To_Deposit_Ratio: number;
}

export interface InterestAndOverdueKPI {
    avg_Loan_Interest_Rate: number;
    avg_Deposit_Interest_Rate: number;
    overdue_Amount: number;
    avg_Account_Size: number;
}


export interface DepositPortfolioOverview {
    total_Balance: number;
    total_Accounts: number;
    avg_Balance: number;
    avg_Interest_Rate: number;
    active_Accounts: number;
    dormant_Accounts: number;
    closed_Accounts: number;
    avg_Account_Size: number;
}

export interface LoanPortfolioOverview {
    total_Loan_Amount: number;
    total_Outstanding: number;
    total_Overdue: number;
    avg_Interest_Rate: number;
    total_Accounts: number;
    active_Accounts: number;
    overdue_Accounts: number;
    avg_Loan_Size: number;
}

export interface DepositTrend {
    year: number;
    month: number;
    monthName: string;
    totalBalance: number;
    accountCount: number;
    averageBalance: number;
}

export interface LoanTrend {
    year: number;
    month: number;
    monthName: string;
    totalOutstanding: number;
    totalSanctioned: number;
    accountCount: number;
    averageLoanSize: number;
}