# Task 1 - Fullstack SchoolAssist Redesign

## Summary
Complete redesign and fix of the SchoolAssist school attendance Next.js application.

## Work Completed
1. Prisma schema adapted for SQLite with correct datasource
2. JWT auth system with jose (signToken, verifyToken, getSession)
3. Middleware for route protection (/admin/*, /api/*)
4. AuthProvider context + useAuth() hook
5. Admin sidebar with shadcn Sidebar component
6. New color scheme: teal primary, amber accent, stone backgrounds
7. Root layout with AuthProvider + ThemeProvider
8. Admin layout with sidebar navigation
9. All pages rewritten with professional design
10. All API routes fixed and created
11. Notifications.ts copied with dynamic nodemailer import

## Key Fixes
- Students API: fixed `s.code` returning `s.name` (was `code: s.name`, now `code: s.code`)
- Students API: added DELETE handler
- Scan API: fixed late detection with proper time comparison (HH:MM instead of just hours)
- Scan API: uses institutionId from auth context
- Settings: connects to real API instead of fake setTimeout
- Login: sets JWT cookie
- Auth: full JWT flow with cookie-based sessions
- All pages use useAuth() hook instead of hardcoded institutionId

## File Structure
- /src/lib/auth.ts - JWT helpers
- /src/lib/notifications.ts - Notification utilities
- /src/middleware.ts - Route protection
- /src/components/auth-provider.tsx - Auth context
- /src/components/admin-sidebar.tsx - Admin sidebar
- /src/components/theme-provider.tsx - Theme provider
- /src/hooks/use-auth.ts - useAuth hook
- /src/app/layout.tsx - Root layout
- /src/app/page.tsx - Landing page
- /src/app/login/page.tsx - Login page
- /src/app/admin/layout.tsx - Admin layout with sidebar
- /src/app/admin/page.tsx - Dashboard with real data + recharts
- /src/app/admin/scan/page.tsx - QR scanner
- /src/app/admin/students/page.tsx - Students CRUD
- /src/app/admin/credentials/page.tsx - Credentials
- /src/app/admin/reports/page.tsx - Reports with charts
- /src/app/admin/staff/page.tsx - Staff management
- /src/app/admin/shifts/page.tsx - Shifts management
- /src/app/admin/settings/page.tsx - Settings with real API
- /src/app/admin/levels/page.tsx - Levels and groups
- /src/app/admin/scanpoints/page.tsx - Scan points
- /src/app/superadmin/page.tsx - Super admin panel
- /src/app/api/auth/login/route.ts - Login with JWT cookie
- /src/app/api/auth/logout/route.ts - Logout
- /src/app/api/auth/me/route.ts - Current user
- /src/app/api/students/route.ts - Fixed students CRUD
- /src/app/api/students/[id]/credential/route.ts - Send credential
- /src/app/api/scan/route.ts - Fixed scan logic
- /src/app/api/dashboard/stats/route.ts - Dashboard stats
- /src/app/api/reports/route.ts - Attendance reports
- /src/app/api/settings/route.ts - Settings CRUD
- /src/app/api/staff/route.ts - Staff CRUD
- /src/app/api/shifts/route.ts - Shifts CRUD
- /src/app/api/levels/route.ts - Levels CRUD
- /src/app/api/groups/route.ts - Groups CRUD
- /src/app/api/scanpoints/route.ts - Scan points CRUD
- /src/app/api/export/students/route.ts - CSV export
- /src/app/api/clear/route.ts - Clear data
- /src/app/api/notifications/route.ts - Notifications
- /src/app/api/superadmin/institutions/route.ts - Super admin institutions
- /src/app/api/superadmin/institutions/[id]/route.ts - Toggle institution
- /src/app/api/superadmin/notify/route.ts - Super admin notifications
- /src/app/api/init/route.ts - Initial setup
