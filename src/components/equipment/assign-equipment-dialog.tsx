import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Spinner } from '../ui/spinner'
import { UserPlus } from 'lucide-react'
import { useAssignInventory } from '@/hooks/inventory/useInventory'
import { useMe } from '@/hooks/auth/useAuth'

interface AssignEquipmentDialogProps {
    id: number
}

const AssignEquipmentDialog = ({ id }: AssignEquipmentDialogProps) => {
    const [open, setOpen] = useState(false)
    const [assignedTo, setAssignedTo] = useState('')
    const { assignInventory, isLoading } = useAssignInventory()
    const { user } = useMe()

    const handleAssign = async () => {
        if (!assignedTo.trim() || !user) return
        await assignInventory({ id, assignedTo: assignedTo.trim(), assignedBy: user.name })
        setOpen(false)
        setAssignedTo('')
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setAssignedTo('') }}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="w-4 h-4" /> Wydaj
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Wydaj sprzęt</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="assignedTo">Przypisz do</Label>
                    <Input
                        id="assignedTo"
                        placeholder="np. Jan Kowalski"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAssign() }}
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" size="sm">Anuluj</Button>
                    </DialogClose>
                    <Button size="sm" disabled={!assignedTo.trim() || isLoading} onClick={handleAssign}>
                        Wydaj {isLoading && <Spinner />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AssignEquipmentDialog
