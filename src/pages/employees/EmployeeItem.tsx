import { Trash } from "lucide-react";

export function EmployeeItem({ username, onDelete }: { username: string; onDelete: (username: string) => void }) {
    return (
      <div className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-white/80">
        <span className="text-sm font-medium">{username}</span>
        <button className="rounded-full border border-border bg-white/70 p-2 transition hover:bg-white" onClick={() => onDelete(username)}>
          <Trash className="h-4 w-4 text-red-500" />
        </button>
      </div>
    );
  }
