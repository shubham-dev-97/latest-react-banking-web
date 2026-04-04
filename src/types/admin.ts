export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalRoles: number;
    totalPages: number;
    todayLogins: number;
    failedLogins: number;
    activeSessions: number;
}

export interface User {
    userID: number;
    userLoginID: string;
    employeeID: string;
    userName: string;
    emailID: string;
    mobileNumber: string;
    roleID: number;
    roleName: string;
    branchID?: number;
    regionID?: number;
    department: string;
    isActive: boolean;
    lastLoginDate?: string;
    createdDate: string;
    updatedDate: string;
}

export interface Role {
    roleID: number;
    roleName: string;
    roleLevel: number;
    roleDescription: string;
    createdDate: string;
    userCount: number;
}

export interface Page {
    pageID: number;
    pageName: string;
    pageCode: string;
    pageCategory: string;
    pageURL: string;
    displayOrder: number;
    isActive: boolean;
    createdDate: string;
}

export interface RolePageAccess {
    accessID: number;
    roleID: number;
    roleName: string;
    pageID: number;
    pageName: string;
    canView: boolean;
    canExport: boolean;
    canDrillDown: boolean;
    createdDate: string;
}

export interface UserBranchAccess {
    accessID: number;
    userID: number;
    userName: string;
    branchID: number;
    accessLevel: string;
    createdDate: string;
}

export interface UserRegionAccess {
    accessID: number;
    userID: number;
    userName: string;
    regionID: number;
    createdDate: string;
}

export interface LoginAudit {
    loginID: number;
    userID: number;
    userName: string;
    loginTime: string;
    logoutTime?: string;
    ipAddress: string;
    deviceType: string;
    loginStatus: string;
    failedAttemptCount: number;
}

export interface BranchAccessRequest {
    branchIds: number[];
    accessLevel: string;
}

export interface RegionAccessRequest {
    regionIds: number[];
}