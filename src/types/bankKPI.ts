// KPI Summary
export interface BankKPISummary {
    total_BRANCHES: number;
    total_CUSTOMERS: number;
    active_CUSTOMERS: number;
    new_CUSTOMERS: number;
    total_DEPOSIT_CR: number;
    total_LOAN_CR: number;
    total_RECOVERY_CR: number;
    avg_GROSS_NPA: number;
    avg_NET_NPA: number;
    avg_CASA_RATIO: number;
    digital_PERCENT: number;
    avg_PERFORMANCE: number;
    total_UPI_TRANSACTION_CR: number;
}

// Yearly Summary
export interface CEOYearlySummary {
    fin_YEAR: string;
    total_BRANCHES: number;
    total_DEPOSIT_CR: number;
    total_LOAN_CR: number;
    total_RECOVERY_CR: number;
    avg_GROSS_NPA: number;
    avg_NET_NPA: number;
    digital_PERCENT: number;
    avg_PERFORMANCE: number;
}

// Region Summary
export interface RegionKPISummary {
    region_NAME: string;
    total_BRANCHES: number;
    total_DEPOSIT_CR: number;
    total_LOAN_CR: number;
    total_RECOVERY_CR: number;
    avg_NPA: number;
    digital_PERCENT: number;
    avg_PERFORMANCE: number;
}

// Branch Performance Item
export interface BranchPerformanceItem {
    pbrCODE: string;
    branch_NAME: string;
    region_NAME: string;
    total_DEPOSIT_ACHIEVED_CR: number;
    total_LOAN_ACHIEVED_CR: number;
    recovery_ACHIEVED_CR: number;
    gross_NPA_PERCENT: number;
    digital_TRANSACTION_PERCENT: number;
    overall_ACHIEVEMENT_PERCENT: number;
    performance_STATUS: string;
}

// Branch Detail Grid
export interface BranchDetailGrid {
    pbrCODE: string;
    branch_NAME: string;
    region_NAME: string;
    total_CUSTOMERS: number;
    active_CUSTOMERS: number;
    new_CUSTOMERS: number;
    staff_COUNT: number;
    total_DEPOSIT_TARGET_CR: number;
    total_DEPOSIT_ACHIEVED_CR: number;
    casa_TARGET_CR: number;
    casa_ACHIEVED_CR: number;
    term_DEPOSIT_TARGET_CR: number;
    term_DEPOSIT_ACHIEVED_CR: number;
    casa_RATIO_PERCENT: number;
    total_LOAN_TARGET_CR: number;
    total_LOAN_ACHIEVED_CR: number;
    msme_LOAN_CR: number;
    gold_LOAN_CR: number;
    recovery_TARGET_CR: number;
    recovery_ACHIEVED_CR: number;
    gross_NPA_PERCENT: number;
    net_NPA_PERCENT: number;
    mobile_BANKING_CUSTOMERS: number;
    internet_BANKING_CUSTOMERS: number;
    upi_TRANSACTION_CR: number;
    digital_TRANSACTION_PERCENT: number;
    overall_ACHIEVEMENT_PERCENT: number;
    performance_STATUS: string;
    branch_RANK: number;
}

// Map Data
export interface BranchMapData {
    pbrCODE: string;
    branch_NAME: string;
    region_NAME: string;
    latitude: number | null;
    longitude: number | null;
    total_DEPOSIT_ACHIEVED_CR: number;
    total_LOAN_ACHIEVED_CR: number;
    recovery_ACHIEVED_CR: number;
    gross_NPA_PERCENT: number;
    digital_TRANSACTION_PERCENT: number;
    overall_ACHIEVEMENT_PERCENT: number;
    performance_STATUS: string;
    google_MAP_LOCATION: string;
}

// Trend Analysis
export interface KPIYearlyTrend {
    fin_YEAR: string;
    total_DEPOSIT_CR: number;
    total_LOAN_CR: number;
    total_RECOVERY_CR: number;
    avg_NPA: number;
    digital_PERCENT: number;
    avg_PERFORMANCE: number;
}

// Actual vs Projection
export interface ActualVsProjection {
    year_TYPE: string;
    total_DEPOSIT_CR: number;
    total_LOAN_CR: number;
    total_RECOVERY_CR: number;
    avg_NPA: number;
    digital_PERCENT: number;
    avg_PERFORMANCE: number;
}

// Complete Response
export interface BankKPIDashboardResponse {
    summary: BankKPISummary;
    yearlySummary: CEOYearlySummary[];
    regionSummary: RegionKPISummary[];
    topBranches: BranchPerformanceItem[];
    bottomBranches: BranchPerformanceItem[];
    branchGrid: BranchDetailGrid[];
    mapData: BranchMapData[];
    trendAnalysis: KPIYearlyTrend[];
    actualVsProjection: ActualVsProjection[];
}