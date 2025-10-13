export const mockDatabase = {
  clients: [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '912345678', status: 'active', subscriptionEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: true, telegram: false } },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '923456789', status: 'active', subscriptionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: true } },
    { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', phone: null, status: 'inactive', subscriptionEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: false, telegram: false } },
    { id: 4, name: 'Ana Ferreira', email: 'ana@email.com', phone: '934567890', status: 'pending', subscriptionEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: true, telegram: true } },
    { id: 5, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '945678901', status: 'active', subscriptionEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: false } },
    { id: 6, name: 'Luísa Pereira', email: 'luisa@email.com', phone: '956789012', status: 'active', subscriptionEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: true, telegram: true } },
    { id: 7, name: 'Rui Martins', email: 'rui@email.com', phone: null, status: 'pending', subscriptionEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), notificationPreferences: { email: true, whatsapp: false, telegram: false } },
    { id: 8, name: 'Sofia Rodrigues', email: 'sofia@email.com', phone: '967890123', status: 'inactive', subscriptionEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), notificationPreferences: { email: false, whatsapp: false, telegram: true } }
  ],
  subscriptions: [
    { id: 1, clientName: 'João Silva', plan: 'annual', startDate: new Date('2024-01-15'), endDate: new Date('2025-01-15'), status: 'active', value: 100.00, manuallyActive: false },
    { id: 2, clientName: 'Maria Santos', plan: 'monthly', startDate: new Date('2024-09-01'), endDate: new Date('2024-09-30'), status: 'inactive', value: 10.00, manuallyActive: false },
    { id: 3, clientName: 'Pedro Costa', plan: 'quarterly', startDate: new Date('2024-07-01'), endDate: new Date('2024-09-25'), status: 'active', value: 30.00, manuallyActive: true },
    { id: 4, clientName: 'Ana Ferreira', plan: 'biannual', startDate: new Date('2024-05-01'), endDate: new Date('2024-11-01'), status: 'active', value: 60.00, manuallyActive: false },
    { id: 5, clientName: 'Carlos Oliveira', plan: 'monthly', startDate: new Date('2024-09-15'), endDate: new Date('2024-10-15'), status: 'active', value: 10.00, manuallyActive: false },
    { id: 6, clientName: 'Luísa Pereira', plan: 'annual', startDate: new Date('2024-03-01'), endDate: new Date('2025-03-01'), status: 'active', value: 100.00, manuallyActive: false },
    { id: 7, clientName: 'Rui Martins', plan: 'quarterly', startDate: new Date('2024-08-01'), endDate: new Date('2024-09-20'), status: 'active', value: 30.00, manuallyActive: true },
    { id: 8, clientName: 'Sofia Rodrigues', plan: 'monthly', startDate: new Date('2024-09-20'), endDate: new Date('2024-10-20'), status: 'active', value: 10.00, manuallyActive: false }
  ],
  payments: [
    { id: 1, clientName: 'João Silva', reference: 'PAY-001', amount: 10.00, method: 'stripe', date: new Date('2024-10-01'), status: 'approved' },
    { id: 2, clientName: 'Maria Santos', reference: 'PAY-002', amount: 30.00, method: 'transfer', date: new Date('2024-09-28'), status: 'pending' },
    { id: 3, clientName: 'Pedro Costa', reference: 'PAY-003', amount: 60.00, method: 'cash', date: new Date('2024-09-25'), status: 'rejected' },
    { id: 4, clientName: 'Ana Ferreira', reference: 'PAY-004', amount: 100.00, method: 'stripe', date: new Date('2024-09-30'), status: 'approved' },
    { id: 5, clientName: 'Carlos Oliveira', reference: 'PAY-005', amount: 10.00, method: 'transfer', date: new Date('2024-10-02'), status: 'pending' },
    { id: 6, clientName: 'Luísa Pereira', reference: 'PAY-006', amount: 30.00, method: 'stripe', date: new Date('2024-09-29'), status: 'approved' },
    { id: 7, clientName: 'Rui Martins', reference: 'PAY-007', amount: 60.00, method: 'cash', date: new Date('2024-09-27'), status: 'pending' },
    { id: 8, clientName: 'Sofia Rodrigues', reference: 'PAY-008', amount: 10.00, method: 'stripe', date: new Date('2024-10-01'), status: 'approved' }
  ]
};
