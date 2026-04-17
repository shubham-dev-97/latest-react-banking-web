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


export interface AlmBucketRBI {
    rbi_BUCKET: string;
    no_OF_ACCOUNTS: number;
    outstanding_BALANCE: number;
    maturity_AMOUNT: number;
}

export interface DepLoanMonthlyTrend {
    month_END: string;
    depositBal: number;
    loanBal: number;
    cd_RATIO_PERCENT: number;
    deposit_tag: string;
    loan_tag: string;
}


export interface RbiLoanAuditDump {
    reporT_DATE: string;
    brancH_ID: number;
    loaN_ACCOUNT_NO: number;
    customeR_ID: string;
    borroweR_NAME: string;
    customeR_TYPE: string;
    dob: string | null;
    gender: string;
    paN_NO: string;
    ckyC_ID: string;
    gsT_NO: string;
    addresS_LINE1: string;
    addresS_LINE2: string;
    addresS_LINE3: string;
    city: string;
    pincode: string;
    mobilE_NO: string;
    emaiL_ID: string;
    loaN_PRODUCT_CODE: string;
    loaN_PURPOSE: string;
    prioritY_SECTOR: string;
    psL_CODE: string;
    customeR_SEGMENT: string;
    sanctioN_DATE: string | null;
    disbursemenT_DATE: string | null;
    sanctioN_AMOUNT: number;
    sanctioneD_BY: string;
    accounT_OPEN_DATE: string | null;
    maturitY_DATE: string | null;
    outstandinG_AMOUNT: number;
    interesT_RECEIVABLE: number;
    emI_AMOUNT: number;
    securitY_VALUE: number;
    roi: number;
    repaymenT_MODE: string;
    tenure: number;
    asseT_CLASSIFICATION: string;
    internaL_RATING: string;
    weakeR_SECTION_FLAG: string;
    securitY_TYPE: string;
    overduE_AMOUNT: number;
    dayS_PAST_DUE: number;
    datE_OF_DEFAULT: string | null;
    provisioN_PERCENT: number;
    secureD_PROVISION: number;
    unsecureD_PROVISION: number;
    totaL_PROVISION: number;
    rbI_ASSET_CLASS: string;
    reporT_TYPE: string;
}

export interface RbiDepositAuditDump {
    report_DATE: string;
    branch_ID: string;
    gl_CODE: string;
    account_NO: string;
    account_NAME: string;
    scheme_CODE: string;
    product_TYPE: string;
    customer_ID: string;
    customer_NAME: string;
    father_NAME: string;
    mother_NAME: string;
    dob: string | null;
    gender: string;
    customer_CATEGORY: string;
    customer_CLASSIFICATION: string;
    customer_STATUS: string;
    kyc_STATUS: string;
    ckyc_NUMBER: string;
    pan: string;
    fatca_STATUS: string;
    aml_RISK_CATEGORY: string;
    form15g_H_STATUS: string;
    account_STATUS: string;
    inoperative_FLAG: string;
    dormant_STATUS: string;
    lien_STATUS: string;
    account_OPEN_DATE: string | null;
    account_CLOSE_DATE: string | null;
    last_TRANSACTION_DATE: string | null;
    deposit_START_DATE: string | null;
    maturity_DATE: string | null;
    deposit_END_DATE: string | null;
    current_BALANCE: number;
    deposit_AMOUNT: number;
    maturity_AMOUNT: number;
    total_CREDITS: number;
    total_DEBITS: number;
    avg_QUARTERLY_BALANCE: number;
    interest_RATE: number;
    interest_PAYOUT_MODE: string;
    total_TRANSACTIONS: number;
    address_LINE1: string;
    address_LINE2: string;
    address_LINE3: string;
    city: string;
    pin_CODE: string;
    state_CODE: string;
    mobile_NO: string;
    email_ID: string;
    member_TYPE: string;
    member_ID: string;
    deposit_RECEIPT_NO: string;
    deposit_TYPE_CODE: string;
    deposit_STATUS: string;
    deposit_TENURE: string;
    deposit_TYPE: string;
    deposit_SIZE_FLAG: string;
    kyc_RISK_FLAG: string;
    aml_RISK_LEVEL: string;
    account_ACTIVITY_STATUS: string;
    audit_REMARK: string;
}