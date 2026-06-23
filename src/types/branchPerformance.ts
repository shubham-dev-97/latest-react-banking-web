// Summary Cards Data
export interface BranchPerformanceSummary {
    totaL_BRANCHES: number;
    totaL_DAILY_RECOVERY_TARGET: number;
    totaL_DAILY_RECOVERY_ACHIEVED: number;
    dailY_RECOVERY_PERCENT: number;
    totaL_CASA_TARGET: number;
    totaL_CASA_ACHIEVED: number;
    casA_PERCENT: number;
    totaL_TERM_DEPOSIT_TARGET: number;
    totaL_TERM_DEPOSIT_ACHIEVED: number;
    terM_DEPOSIT_PERCENT: number;
    totaL_NEW_CUSTOMERS: number;
    totaL_MOBILE_BANKING_CUSTOMERS: number;
    avG_NPA_PERCENT: number;
    avG_OVERALL_ACHIEVEMENT: number;
    lasT_UPDATED: string;
}

// Branch Performance Grid
export interface BranchPerformanceGrid {
    brancH_RANK: number;
    pbrcode: string;
    brancH_NAME: string;
    brancH_MANAGER: string;
    dailY_RECOVERY_TARGET: number;
    dailY_RECOVERY_ACHIEVED: number;
    dailY_RECOVERY_PERCENT: number;
    casA_TARGET_CR: number;
    casA_ACHIEVED_CR: number;
    casA_PERCENT: number;
    terM_DEPOSIT_TARGET_CR: number;
    terM_DEPOSIT_ACHIEVED_CR: number;
    terM_DEPOSIT_PERCENT: number;
    neW_CUSTOMERS: number;
    mobilE_BANKING_CUSTOMERS: number;
    npA_PERCENT: number;
    overalL_ACHIEVEMENT_PERCENT: number;
    performancE_STATUS: string;
    statuS_COLOR: string;
}

// Region Summary
export interface RegionSummary {
    regioN_NAME: string;
    totaL_BRANCHES: number;
    totaL_DEPOSIT: number;
    totaL_LOAN: number;
    totaL_RECOVERY: number;
    avG_PERFORMANCE_PERCENT: number;
}

// Top Branches
export interface TopBranch {
    brancH_RANK: number;
    pbrcode: string;
    brancH_NAME: string;
    brancH_MANAGER: string;
    overalL_ACHIEVEMENT_PERCENT: number;
    performancE_STATUS: string;
    npA_PERCENT: number;
}

// Complete Response
export interface BranchPerformanceResponse {
    summary: BranchPerformanceSummary;
    branchGrid: BranchPerformanceGrid[];
    regionSummary: RegionSummary[];
    topBranches: TopBranch[];
}