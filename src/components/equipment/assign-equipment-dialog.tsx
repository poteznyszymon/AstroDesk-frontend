import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { UserPlus, Check, Search } from 'lucide-react'
import { useAssignInventory } from '@/hooks/inventory/useInventory'
import { useMe } from '@/hooks/auth/useAuth'
import { useUsers } from '@/hooks/user/useUsers'
import { cn } from '@/lib/utils'
import type { User, UserRole } from '@/types/user'
import { Input } from '../ui/input'

const roleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
        USER: 'Użytkownik',
        TICKET_ADMIN: 'Admin ticketów',
        ASSET_ADMIN: 'Admin sprzętu',
        HEADADMIN: 'Główny admin',
    }
    return labels[role]
}

interface AssignEquipmentDialogProps {
    id: number
}

const AssignEquipmentDialog = ({ id }: AssignEquipmentDialogProps) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const { assignInventory, isLoading } = useAssignInventory()
    const { user } = useMe()
    const { data: users, isLoading: isUsersLoading } = useUsers()

    const filtered = (users ?? []).filter((u) => {
        const q = search.toLowerCase()
        return (
            u.firstName.toLowerCase().includes(q) ||
            u.lastName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
    })

    const handleAssign = async () => {
        if (!selectedUser || !user) return
        await assignInventory({
            id,
            assignedTo: selectedUser.username,
            assignedBy: user.username,
        })
        setOpen(false)
    }

    const handleOpenChange = (v: boolean) => {
        setOpen(v)
        if (!v) {
            setSelectedUser(null)
            setSearch('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="w-4 h-4" /> Wydaj
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm gap-4">
                <DialogHeader>
                    <DialogTitle>Wydaj sprzęt</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Szukaj użytkownika..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto rounded-md border bg-background">
                        {isUsersLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Spinner />
                            </div>
                        ) : filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                Nie znaleziono użytkownika.
                            </p>
                        ) : (
                            filtered.map((u) => {
                                const isSelected = selectedUser?.username === u.username
                                return (
                                    <button
                                        key={u.username}
                                        type="button"
                                        onClick={() => setSelectedUser(isSelected ? null : u)}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer',
                                            'hover:bg-muted/60',
                                            isSelected && 'bg-muted',
                                        )}
                                    >
                                        <div className={cn(
                                            'flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0',
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground',
                                        )}>
                                            {isSelected
                                                ? <Check className="w-3.5 h-3.5" />
                                                : `${u.firstName[0]}${u.lastName[0]}`}
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-sm font-medium leading-tight">
                                                {u.firstName} {u.lastName}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">{u.email}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground/70 shrink-0">{roleLabel(u.role)}</span>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" size="sm">Anuluj</Button>
                    </DialogClose>
                    <Button size="sm" disabled={!selectedUser || isLoading} onClick={handleAssign}>
                        Wydaj {isLoading && <Spinner />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AssignEquipmentDialog
