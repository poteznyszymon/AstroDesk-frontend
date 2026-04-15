import { useState, useRef, useEffect } from 'react';
import { useTicketMessages, useAddTicketMessage, useDeleteTicketMessage, useUpdateTicketMessage } from '@/hooks/ticket/useTickets';
import { useMe } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Send, Pencil, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { TicketMessage } from '@/hooks/ticket/mock.ticket-messages';

interface TicketMessagesProps {
  ticketId: string;
}

function MessageBubble({
  msg,
  isOwn,
  onDeleteRequest,
  onEditRequest,
}: {
  msg: TicketMessage;
  isOwn: boolean;
  onDeleteRequest: (msg: TicketMessage) => void;
  onEditRequest: (msg: TicketMessage) => void;
}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          {!isOwn && <span className="text-xs text-muted-foreground">{msg.author}</span>}
          <span className="text-xs text-muted-foreground">
            {format(new Date(msg.createdAt), 'dd.MM.yyyy HH:mm', { locale: pl })}
          </span>
          {isOwn && <span className="text-xs text-muted-foreground">{msg.author}</span>}
        </div>
        <div className={`group flex items-center gap-1.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words ${
              isOwn
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-muted text-foreground rounded-tl-none'
            }`}
          >
            {msg.content}
          </div>
          {isOwn && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                  <DropdownMenuItem onClick={() => onEditRequest(msg)}>
                    <Pencil className="w-3.5 h-3.5 mr-2" />
                    Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={() => onDeleteRequest(msg)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2 text-destructive" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TicketMessages({ ticketId }: TicketMessagesProps) {
  const { data: messages, isLoading } = useTicketMessages(ticketId);
  const { addMessage, isLoading: isSending } = useAddTicketMessage(ticketId);
  const { deleteMessage, isLoading: isDeleting } = useDeleteTicketMessage(ticketId);
  const { updateMessage, isLoading: isUpdating } = useUpdateTicketMessage(ticketId);
  const { user } = useMe();
  const [content, setContent] = useState('');
  const [editTarget, setEditTarget] = useState<TicketMessage | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<TicketMessage | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || !user) return;
    setContent('');
    await addMessage({ content: trimmed, author: `${user.firstName} ${user.lastName}` });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  };

  const openEdit = (msg: TicketMessage) => {
    setEditTarget(msg);
    setEditContent(msg.content);
  };

  const handleEditSave = async () => {
    if (!editTarget || !editContent.trim()) return;
    await updateMessage({ messageId: editTarget.id, content: editContent.trim() });
    setEditTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteMessage(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col gap-1 max-w-[70%]">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 min-h-[120px] max-h-[400px] overflow-y-auto">
          {!messages || messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak wiadomości. Napisz pierwszą.</p>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isOwn={msg.author === (user ? `${user.firstName} ${user.lastName}` : undefined)}
                onDeleteRequest={setDeleteTarget}
                onEditRequest={openEdit}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 items-center border-t pt-4">
          <Input
            placeholder="Napisz wiadomość..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className="w-fit"
          />
          <Button size="sm" className="gap-1.5 shrink-0" onClick={handleSend} disabled={isSending || !content.trim()}>
            <Send className="w-4 h-4" />
            Wyślij
          </Button>
        </div>
      </div>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edytuj wiadomość</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-20 max-h-40 resize-none"
            disabled={isUpdating}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isUpdating} onClick={() => setEditTarget(null)}>
              Anuluj
            </Button>
            <Button size="sm" disabled={isUpdating || !editContent.trim()} onClick={handleEditSave}>
              Zapisz
              {isUpdating && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Usuń wiadomość</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Czy na pewno chcesz usunąć tę wiadomość? Tej operacji nie można cofnąć.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
              Anuluj
            </Button>
            <Button variant="destructive" size="sm" disabled={isDeleting} onClick={handleDeleteConfirm}>
              Usuń
              {isDeleting && <Spinner />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
