import { Trash } from "lucide-react";

export function EmployeeItem({ username, onDelete }: { username: string; onDelete: (username: string) => void }) {
    return (
      <div className="flex items-center justify-between p-2 border-b">
        <span>{username}</span>
        <button onClick={() => onDelete(username)}>
          <Trash className="text-red-500 hover:text-red-700 cursor-pointer" />
        </button>
      </div>
    );
  }