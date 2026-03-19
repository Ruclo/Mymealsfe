import { Link, useNavigate } from 'react-router-dom';
import { LinkLabel } from '@/types/link';
import { useAuth } from '@/api/auth';

export function AdminPage() {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const links: LinkLabel[] = [
        {to: 'employees', label: 'Manage Employees'},
        {to: 'meals', label: 'Open meal menu'},
        {to: 'orders', label: 'View Orders'},
        {to: 'orders/pending', label: 'View Pending Orders'},
        {to: 'change-password', label: 'Change Password'},
        {to: 'logout', label: 'Log out'}
    ]

    return (
        <div className="px-4 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                    <h1 className="display-serif text-3xl">Dashboard</h1>
                </div>
                <button
                    className="rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold transition hover:bg-white"
                    onClick={async () => {
                        await logout()
                        navigate("/")
                    }}
                >
                    Log out
                </button>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
                {links.filter(link => link.to !== "logout").map((link) => (
                    <Link to={link.to} key={link.to} className="rounded-2xl border border-border bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Admin</div>
                        <div className="mt-2 text-lg font-semibold">{link.label}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
