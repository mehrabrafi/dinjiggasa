import { NextResponse, NextRequest } from 'next/server';

// ============================================================
// 🛡️  DinJiggasa Full Route Protection Middleware
// ============================================================
// This middleware runs on every page request (server-side) and
// enforces three layers of security:
//   1. Authentication  — Is the user logged in?
//   2. Authorization   — Does the user have the right role?
//   3. Auth-page guard — Prevent logged-in users from visiting
//                        login / register pages.
// ============================================================

// ---------- Role definitions (must match Prisma enum) ----------
type Role = 'USER' | 'SCHOLAR' | 'MODERATOR' | 'ADMIN';

// ---------- Route definitions ----------

// Routes that require the user to be logged in (any role)
const authenticatedRoutes = [
    '/settings',
    '/notifications',
    '/my-feed',
    '/my-questions',
    '/ask',
];

// Routes that require specific roles
// The user must be logged in AND have one of the listed roles.
const roleProtectedRoutes: { path: string; allowedRoles: Role[] }[] = [
    {
        path: '/scholar-panel',
        allowedRoles: ['SCHOLAR', 'ADMIN'],
    },
    {
        path: '/moderator-panel',
        allowedRoles: ['MODERATOR', 'ADMIN'],
    },
];

// Routes that logged-in users should NOT be able to visit
// (they get redirected to home instead)
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// ---------- Helper: safely parse user cookie ----------
function getUserFromCookie(request: NextRequest): { role?: Role } | null {
    const userStr = request.cookies.get('user')?.value;
    if (!userStr) return null;
    try {
        return JSON.parse(decodeURIComponent(userStr));
    } catch {
        return null;
    }
}

// ---------- Middleware ----------
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // ── 1. Role-protected routes (most restrictive — check first) ──
    const roleRoute = roleProtectedRoutes.find((route) =>
        pathname.startsWith(route.path)
    );

    if (roleRoute) {
        // Not logged in → redirect to login
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }

        // Logged in but wrong role → redirect to home with a denial flag
        const user = getUserFromCookie(request);
        const userRole = user?.role as Role | undefined;

        if (!userRole || !roleRoute.allowedRoles.includes(userRole)) {
            const url = new URL('/', request.url);
            url.searchParams.set('unauthorized', '1');
            return NextResponse.redirect(url);
        }

        // User is authenticated AND has the right role → allow
        return NextResponse.next();
    }

    // ── 2. Authenticated-only routes (any logged-in user) ──
    const isAuthenticatedRoute = authenticatedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isAuthenticatedRoute && !token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // ── 3. Auth-page guard (prevent logged-in users from seeing login/register) ──
    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── 4. Everything else is public ──
    return NextResponse.next();
}

// ---------- Matcher ----------
export const config = {
    matcher: [
        /*
         * Run middleware on all routes EXCEPT:
         * - api            (API routes)
         * - _next/static   (static assets like JS/CSS)
         * - _next/image    (Next.js image optimization)
         * - favicon.ico    (browser icon)
         * - public assets  (images, fonts, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
