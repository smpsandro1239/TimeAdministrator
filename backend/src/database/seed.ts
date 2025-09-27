import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { PaymentsService } from '../payments/payments.service';
import { UserRole } from '../users/enums/user-role.enum';
import { SubscriptionPeriod } from '../subscriptions/enums/subscription-period.enum';
import { SubscriptionStatus } from '../subscriptions/enums/subscription-status.enum';
import { PaymentStatus } from '../payments/enums/payment-status.enum';
import { PaymentMethod } from '../payments/enums/payment-method.enum';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const clientsService = app.get(ClientsService);
  const subscriptionsService = app.get(SubscriptionsService);
  const paymentsService = app.get(PaymentsService);

  try {
    // Verificar se já existe um admin
    const existingAdmin = await usersService.findByEmail('admin@timeadministrator.com');
    
    if (!existingAdmin) {
      // Criar utilizador admin
      await usersService.create({
        name: 'Administrador',
        email: 'admin@timeadministrator.com',
        password: 'admin123', // Plain password for testing
        role: UserRole.ADMIN,
        phone: '+351912345678',
      });

      console.log('✅ Utilizador admin criado com sucesso!');
      console.log('📧 Email: admin@timeadministrator.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Utilizador admin já existe');
    }

    // Criar utilizador cliente de teste
    const existingClient = await usersService.findByEmail('cliente@teste.com');

    if (!existingClient) {
      await usersService.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        password: 'cliente123', // Plain password for testing
        role: UserRole.CLIENT,
        phone: '+351987654321',
      });

      console.log('✅ Utilizador cliente de teste criado!');
      console.log('📧 Email: cliente@teste.com');
      console.log('🔑 Password: cliente123');
    } else {
      console.log('ℹ️ Utilizador cliente de teste já existe');
    }

    // Criar utilizador Sandro
    const existingSandro = await usersService.findByEmail('sandro@gmail.com');

    if (!existingSandro) {
      await usersService.create({
        name: 'Sandro Admin',
        email: 'sandro@gmail.com',
        password: '1234567890aa', // Plain password for testing
        role: UserRole.ADMIN,
        phone: '+351912345678',
      });

      console.log('✅ Utilizador Sandro criado!');
      console.log('📧 Email: sandro@gmail.com');
      console.log('🔑 Password: 1234567890aa');
    } else {
      console.log('ℹ️ Utilizador Sandro já existe');
    }

    // Criar dados de teste para demonstração
    console.log('\n🌱 Criando dados de teste...');

    // Criar cliente para o usuário cliente@teste.com
    const clientUser = await usersService.findByEmail('cliente@teste.com');
    if (clientUser) {
      const existingClient = await clientsService.findByEmail('cliente@teste.com');
      if (!existingClient) {
        const client = await clientsService.create({
          name: 'Cliente Teste',
          email: 'cliente@teste.com',
          phone: '+351987654321',
          isActive: true,
          notes: 'Cliente de teste para demonstração'
        });

        console.log('✅ Cliente criado:', client.name);

        // Criar subscrição ativa
        const subscription = await subscriptionsService.create({
          clientId: (client as any)._id.toString(),
          period: SubscriptionPeriod.ONE_YEAR,
          status: SubscriptionStatus.ACTIVE,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
          renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          price: 120.00,
          autoRenew: true,
          notes: 'Subscrição anual de teste'
        });

        console.log('✅ Subscrição criada para:', client.name);

        // Criar pagamento
        await paymentsService.create({
          clientId: (client as any)._id.toString(),
          amount: 120.00,
          method: PaymentMethod.MANUAL,
          subscriptionPeriod: SubscriptionPeriod.ONE_YEAR,
          notes: 'Pagamento da subscrição anual'
        });

        console.log('✅ Pagamento criado para:', client.name);
      } else {
        console.log('ℹ️ Cliente já existe');
      }
    }

    // Criar mais alguns clientes de teste
    const testClients = [
      { name: 'João Silva', email: 'joao.silva@email.com', phone: '+351911111111' },
      { name: 'Maria Santos', email: 'maria.santos@email.com', phone: '+351922222222' },
      { name: 'Pedro Costa', email: 'pedro.costa@email.com', phone: '+351933333333' },
      { name: 'Ana Oliveira', email: 'ana.oliveira@email.com', phone: '+351944444444' },
      { name: 'Carlos Ferreira', email: 'carlos.ferreira@email.com', phone: '+351955555555' }
    ];

    for (const clientData of testClients) {
      const existingClient = await clientsService.findByEmail(clientData.email);
      if (!existingClient) {
        const client = await clientsService.create({
          ...clientData,
          isActive: Math.random() > 0.3, // 70% ativos
          notes: 'Cliente criado automaticamente para testes'
        });

        console.log('✅ Cliente adicional criado:', client.name);

        // Criar subscrição com status variado
        const isActive = Math.random() > 0.4; // 60% com subscrição ativa
        if (isActive) {
          const period = Math.random() > 0.5 ? SubscriptionPeriod.ONE_YEAR : SubscriptionPeriod.THREE_MONTHS;
          const subscription = await subscriptionsService.create({
            clientId: (client as any)._id.toString(),
            period: period,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + (period === SubscriptionPeriod.ONE_YEAR ? 365 : 90) * 24 * 60 * 60 * 1000).toISOString(),
            renewalDate: new Date(Date.now() + (period === SubscriptionPeriod.ONE_YEAR ? 365 : 90) * 24 * 60 * 60 * 1000).toISOString(),
            price: period === SubscriptionPeriod.ONE_YEAR ? 120.00 : 45.00,
            autoRenew: Math.random() > 0.3,
            notes: 'Subscrição criada automaticamente'
          });

          // Criar pagamento
          await paymentsService.create({
            clientId: (client as any)._id.toString(),
            amount: subscription.price,
            method: PaymentMethod.MANUAL,
            subscriptionPeriod: period,
            notes: 'Pagamento da subscrição'
          });
        }
      }
    }

    console.log('✅ Dados de teste criados com sucesso!');
    console.log('📊 Resumo:');
    console.log('   - 3 usuários (1 admin, 2 clientes)');
    console.log('   - 6+ clientes');
    console.log('   - Subscrições ativas');
    console.log('   - Pagamentos processados');

  } catch (error) {
    console.error('❌ Erro ao criar dados:', error);
  } finally {
    await app.close();
  }
}

seed();