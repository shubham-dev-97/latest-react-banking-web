export const PAGES = {
    ADMIN: '/admin',
    HOME: '/ceo-dashboard',  
    DEPOSIT: '/deposit',
    LOAN: '/loan',
    SUMMARY: '/summary',
    CASA: '/casa',
    GL: '/gl-dashboard',
};
export type PagePath = typeof PAGES[keyof typeof PAGES];

// Helper to get user role consistently
export const getUserRole = (user: any): string => {
    if (!user) return '';
    const role = user.roleName || user.role || user.RoleName || user.Role;
    return role || '';
};

// Define role-based access rules with ALL roles from your database
const roleAccessRules: Record<string, PagePath[]> = {
    'Chairman': [
        PAGES.ADMIN,  // ADDED: Chairman has access to Admin
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN,
        PAGES.SUMMARY,
        PAGES.CASA,
        PAGES.GL
    ],
    'CEO': [
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN,
        PAGES.SUMMARY,
        PAGES.CASA,
        PAGES.GL
    ],
    'GM': [
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN,
        PAGES.SUMMARY
    ],
    'AGM': [
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN,
        PAGES.SUMMARY
    ],
    'Manager': [
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN
    ],
    'Officer': [
        PAGES.HOME,
        PAGES.DEPOSIT
    ],
    'Clerk': [
        PAGES.HOME
    ],
    'ITAdmin': [
        PAGES.ADMIN,
        PAGES.HOME,
        PAGES.DEPOSIT,
        PAGES.LOAN,
        PAGES.SUMMARY,
        PAGES.CASA,
        PAGES.GL
    ],
    'ComplianceOfficer': [
        PAGES.SUMMARY,
        PAGES.CASA,
        PAGES.GL
    ]
};

// Get allowed page paths for a role
export const getAllowedPages = (role: string): PagePath[] => {
    return roleAccessRules[role] || [PAGES.HOME];
};

// Check if user has access to a specific page
export const hasPageAccess = (user: any, pagePath: string): boolean => {
    if (!user) return false;
    
    const role = getUserRole(user);
    const allowedPages = getAllowedPages(role);
    
    // Allow access if page is in allowed pages
    return allowedPages.includes(pagePath as PagePath);
};

// Get default route for a user
export const getDefaultRoute = (role: string): string => {
    const allowedPages = getAllowedPages(role);
    return allowedPages[0] || PAGES.HOME;
};