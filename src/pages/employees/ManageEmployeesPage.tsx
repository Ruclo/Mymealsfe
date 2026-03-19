import { useDeleteStaff, useStaffQuery } from "@/api/users";
import { EmployeeItem } from "./EmployeeItem";
import { Link } from "react-router-dom";

export function ManageEmployeesPage() {
    const {data} = useStaffQuery()
    const deleteEmployeeMutation = useDeleteStaff()

    const handleDeleteEmployee = async (username: string) => {
        deleteEmployeeMutation.mutate(username)
    }

    return (
        <div className="px-4 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
                    <h1 className="display-serif text-3xl">Staff</h1>
                </div>
                <Link to='create' className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold transition hover:bg-white">
                    Add staff
                </Link>
            </header>
            <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm">
                {data != null && data.map(employee => (
                    <EmployeeItem key={employee.username} username={employee.username} onDelete={handleDeleteEmployee}/>
                ))}
            </div>
        </div>
    )
}
