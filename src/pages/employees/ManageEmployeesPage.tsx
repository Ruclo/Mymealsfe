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
        <div>
            <h2 className="text-2xl">Staff</h2>
            {data != null && data.map(employee => (
                <EmployeeItem key={employee.username} username={employee.username} onDelete={handleDeleteEmployee}/>
            ))}
            <Link to='create'>Add staff</Link>
        </div>
    )
}