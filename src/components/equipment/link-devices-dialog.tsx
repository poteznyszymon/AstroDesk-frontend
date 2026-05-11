import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Link2, Check, Search, Monitor, Laptop, Printer, Smartphone, Router, Network } from 'lucide-react'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { useInventory, useAddInventoryConnection } from '@/hooks/inventory/useInventory'
import type { Inventory, InventoryConnection, InventoryItemType } from '@/types/inventory'

const typeConfig: Record<InventoryItemType, { label: string; icon: React.ElementType }> = {
    LAPTOP:    { label: 'Laptop',    icon: Laptop },
    KOMPUTER:  { label: 'Komputer',  icon: Monitor },
    DRUKARKA:  { label: 'Drukarka',  icon: Printer },
    ROUTER:    { label: 'Router',    icon: Router },
    SWITCH:    { label: 'Switch',    icon: Network },
    TELEFON:   { label: 'Telefon',   icon: Smartphone },
}

interface LinkDevicesDialogProps {
    deviceId: number
    existingConnections: InventoryConnection[]
}

const LinkDevicesDialog = ({ deviceId, existingConnections }: LinkDevicesDialogProps) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState<Inventory | null>(null)
    const { data: allDevices, isLoading: isDevicesLoading } = useInventory()
    const { addConnection, isLoading } = useAddInventoryConnection(deviceId)

    const connectedIds = new Set(existingConnections.map((c) => c.connectedDeviceId))

    const filtered = (allDevices ?? []).filter((d) => {
        if (d.id === deviceId) return false
        if (connectedIds.has(d.id)) return false
        const q = search.toLowerCase()
        return (
            d.name.toLowerCase().includes(q) ||
            d.serialNumber.toLowerCase().includes(q) ||
            (d.model ?? '').toLowerCase().includes(q)
        )
    })

    const handleLink = async () => {
        if (!selected) return
        await addConnection(selected.id)
        setOpen(false)
    }

    const handleOpenChange = (v: boolean) => {
        setOpen(v)
        if (!v) {
            setSelected(null)
            setSearch('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <Link2 className="w-4 h-4" /> Powiąż urządzenie
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm gap-4">
                <DialogHeader>
                    <DialogTitle>Powiąż urządzenie</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Szukaj po nazwie lub numerze seryjnym..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto rounded-md border bg-background">
                        {isDevicesLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Spinner />
                            </div>
                        ) : filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                Nie znaleziono urządzenia.
                            </p>
                        ) : (
                            filtered.map((device) => {
                                const isSelected = selected?.id === device.id
                                const config = typeConfig[device.itemType]
                                const TypeIcon = config.icon
                                return (
                                    <button
                                        key={device.id}
                                        type="button"
                                        onClick={() => setSelected(isSelected ? null : device)}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer',
                                            'hover:bg-muted/60',
                                            isSelected && 'bg-muted',
                                        )}
                                    >
                                        <div className={cn(
                                            'flex items-center justify-center w-7 h-7 rounded-full shrink-0',
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground',
                                        )}>
                                            {isSelected
                                                ? <Check className="w-3.5 h-3.5" />
                                                : <TypeIcon className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-sm font-medium leading-tight truncate">
                                                {device.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {device.serialNumber}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground/70 shrink-0">
                                            {config.label}
                                        </span>
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
                    <Button size="sm" disabled={!selected || isLoading} onClick={handleLink}>
                        Powiąż {isLoading && <Spinner />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LinkDevicesDialog
