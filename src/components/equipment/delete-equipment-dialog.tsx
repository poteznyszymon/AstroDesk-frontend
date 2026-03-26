import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Trash2 } from 'lucide-react'
import { useDeleteInventory } from '@/hooks/inventory/useInventory'

interface DeleteEquipmentDialogProps {
    id: number;
    name: string;
}

const DeleteEquipmentDialog = ({ id, name }: DeleteEquipmentDialogProps) => {
    const [open, setOpen] = useState(false);
    const { deleteInventory, isLoading } = useDeleteInventory();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteInventory(id);
        setOpen(false);
        navigate({ to: '/inventory' });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive" className="gap-2 flex-1 xs:flex-none">
                    <Trash2 className="w-4 h-4" /> Usuń
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Usuń sprzęt</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Czy na pewno chcesz usunąć <span className="font-medium text-foreground">{name}</span>? Tej operacji nie można cofnąć.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" size="sm" disabled={isLoading}>
                            Anuluj
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading}>
                        Usuń
                        {isLoading && <Spinner />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteEquipmentDialog;
