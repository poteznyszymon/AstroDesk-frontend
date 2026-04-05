export interface TicketMessage {
  id: string;
  ticketId: number;
  content: string;
  author: string;
  createdAt: string;
}

export const mockTicketMessages: Record<number, TicketMessage[]> = {
  1: [
    {
      id: "msg-001",
      ticketId: 1,
      content: "Sprawdziłem logi — problem dotyczy wygasłego tokenu sesji. Pracuję nad poprawką.",
      author: "Jan Kowalski",
      createdAt: "2025-12-01T09:15:00",
    },
    {
      id: "msg-002",
      ticketId: 1,
      content: "Czy problem dotyczy tylko tego jednego użytkownika czy wielu?",
      author: "Anna Nowak",
      createdAt: "2025-12-01T10:30:00",
    },
    {
      id: "msg-003",
      ticketId: 1,
      content: "Na razie zgłoszenie przyszło od jednej osoby, ale możliwe że inni jeszcze nie zauważyli.",
      author: "Jan Kowalski",
      createdAt: "2025-12-01T10:45:00",
    },
  ],
  2: [
    {
      id: "msg-004",
      ticketId: 2,
      content: "Zamówiłem nowy bęben do drukarki, powinien dotrzeć jutro.",
      author: "Anna Nowak",
      createdAt: "2025-11-30T14:00:00",
    },
  ],
};

let msgIdCounter = 100;

export function addTicketMessageMock(ticketId: string, content: string, author: string): Promise<TicketMessage> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numId = Number(ticketId);
      const message: TicketMessage = {
        id: `msg-gen-${msgIdCounter++}`,
        ticketId: numId,
        content,
        author,
        createdAt: new Date().toISOString(),
      };
      if (!mockTicketMessages[numId]) mockTicketMessages[numId] = [];
      mockTicketMessages[numId].push(message);
      resolve(message);
    }, 300);
  });
}

export function getTicketMessagesMock(ticketId: string): Promise<TicketMessage[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTicketMessages[Number(ticketId)] ?? []);
    }, 200);
  });
}

export function deleteTicketMessageMock(ticketId: string, messageId: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const numId = Number(ticketId);
      if (mockTicketMessages[numId]) {
        mockTicketMessages[numId] = mockTicketMessages[numId].filter((m) => m.id !== messageId);
      }
      resolve();
    }, 200);
  });
}

export function updateTicketMessageMock(ticketId: string, messageId: string, content: string): Promise<TicketMessage> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const messages = mockTicketMessages[Number(ticketId)];
      if (!messages) return reject(new Error('Not found'));
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return reject(new Error('Not found'));
      msg.content = content;
      resolve({ ...msg });
    }, 200);
  });
}
