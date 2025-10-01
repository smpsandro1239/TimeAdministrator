import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';

@Component({
  selector: 'app-settings-simple',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="container">
        <div class="header">
          <h1>Configurações do Sistema</h1>
          <p>Gestão de configurações gerais e preferências</p>
        </div>

        <mat-tab-group>
          <mat-tab label="Geral">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Informações da Empresa</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Nome da Empresa</mat-label>
                      <input matInput value="TimeAdministrator">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Email de Contacto</mat-label>
                      <input matInput value="suporte@timeadministrator.com">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Telefone</mat-label>
                      <input matInput value="+351 912 345 678">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Website</mat-label>
                      <input matInput value="https://timeadministrator.com">
                    </mat-form-field>
                  </div>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Morada</mat-label>
                    <textarea matInput rows="3">Rua das Empresas, 123
1000-001 Lisboa
Portugal</textarea>
                  </mat-form-field>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary">Guardar Alterações</button>
                </mat-card-actions>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configurações de Sistema</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="settings-list">
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Modo de Manutenção</div>
                        <div class="setting-description">Desactivar temporariamente o acesso ao sistema</div>
                      </div>
                      <mat-slide-toggle [checked]="false"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Registos Automáticos</div>
                        <div class="setting-description">Permitir que novos utilizadores se registem</div>
                      </div>
                      <mat-slide-toggle [checked]="true"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Logs Detalhados</div>
                        <div class="setting-description">Activar logging detalhado do sistema</div>
                      </div>
                      <mat-slide-toggle [checked]="true"></mat-slide-toggle>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Pagamentos">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configuração Stripe</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="config-status">
                    <div class="status-indicator connected">
                      <mat-icon>check_circle</mat-icon>
                      <span>Conectado</span>
                    </div>
                  </div>
                  
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Chave Pública</mat-label>
                      <input matInput value="pk_test_***************" type="password">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Chave Secreta</mat-label>
                      <input matInput value="sk_test_***************" type="password">
                    </mat-form-field>
                  </div>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Webhook Endpoint</mat-label>
                    <input matInput value="https://api.timeadministrator.com/webhooks/stripe">
                  </mat-form-field>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Testar Ligação</button>
                  <button mat-raised-button color="primary">Guardar</button>
                </mat-card-actions>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Preços dos Planos</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="plans-grid">
                    <div class="plan-item">
                      <div class="plan-name">Plano Mensal</div>
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (€)</mat-label>
                        <input matInput value="29.99" type="number">
                      </mat-form-field>
                    </div>
                    
                    <div class="plan-item">
                      <div class="plan-name">Plano Trimestral</div>
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (€)</mat-label>
                        <input matInput value="79.99" type="number">
                      </mat-form-field>
                    </div>
                    
                    <div class="plan-item">
                      <div class="plan-name">Plano Semestral</div>
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (€)</mat-label>
                        <input matInput value="149.99" type="number">
                      </mat-form-field>
                    </div>
                    
                    <div class="plan-item">
                      <div class="plan-name">Plano Anual</div>
                      <mat-form-field appearance="outline">
                        <mat-label>Preço (€)</mat-label>
                        <input matInput value="279.99" type="number">
                      </mat-form-field>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary">Actualizar Preços</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Notificações">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configuração de Email</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="config-status">
                    <div class="status-indicator connected">
                      <mat-icon>check_circle</mat-icon>
                      <span>Conectado</span>
                    </div>
                  </div>
                  
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Servidor SMTP</mat-label>
                      <input matInput value="smtp.gmail.com">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Porta</mat-label>
                      <input matInput value="587" type="number">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput value="noreply@timeadministrator.com">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Palavra-passe</mat-label>
                      <input matInput value="***************" type="password">
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Testar Email</button>
                  <button mat-raised-button color="primary">Guardar</button>
                </mat-card-actions>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configuração WhatsApp</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="config-status">
                    <div class="status-indicator disconnected">
                      <mat-icon>error</mat-icon>
                      <span>Desconectado</span>
                    </div>
                  </div>
                  
                  <div class="form-grid">
                    <mat-form-field appearance="outline">
                      <mat-label>Account SID</mat-label>
                      <input matInput placeholder="Twilio Account SID">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Auth Token</mat-label>
                      <input matInput placeholder="Twilio Auth Token" type="password">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Número WhatsApp</mat-label>
                      <input matInput placeholder="+1234567890">
                    </mat-form-field>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Testar WhatsApp</button>
                  <button mat-raised-button color="primary">Guardar</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>

          <mat-tab label="Segurança">
            <div class="tab-content">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Configurações de Segurança</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="settings-list">
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Autenticação de Dois Factores</div>
                        <div class="setting-description">Exigir 2FA para administradores</div>
                      </div>
                      <mat-slide-toggle [checked]="false"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Sessões Múltiplas</div>
                        <div class="setting-description">Permitir múltiplas sessões por utilizador</div>
                      </div>
                      <mat-slide-toggle [checked]="true"></mat-slide-toggle>
                    </div>
                    
                    <div class="setting-item">
                      <div class="setting-info">
                        <div class="setting-title">Timeout de Sessão</div>
                        <div class="setting-description">Tempo limite de inactividade</div>
                      </div>
                      <mat-form-field appearance="outline">
                        <mat-label>Minutos</mat-label>
                        <mat-select value="30">
                          <mat-option value="15">15 minutos</mat-option>
                          <mat-option value="30">30 minutos</mat-option>
                          <mat-option value="60">1 hora</mat-option>
                          <mat-option value="120">2 horas</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary">Guardar Configurações</button>
                </mat-card-actions>
              </mat-card>

              <mat-card>
                <mat-card-header>
                  <mat-card-title>Backup e Restauro</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="backup-info">
                    <div class="backup-item">
                      <mat-icon>backup</mat-icon>
                      <div>
                        <div class="backup-title">Último Backup</div>
                        <div class="backup-date">15/01/2024 às 03:00</div>
                      </div>
                    </div>
                    
                    <div class="backup-item">
                      <mat-icon>schedule</mat-icon>
                      <div>
                        <div class="backup-title">Próximo Backup</div>
                        <div class="backup-date">16/01/2024 às 03:00</div>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button>Fazer Backup Agora</button>
                  <button mat-button>Restaurar Backup</button>
                  <button mat-raised-button color="primary">Configurar Agendamento</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </app-layout>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    .header { margin-bottom: 24px; }
    .header h1 { margin: 0; color: #1976d2; font-size: 28px; }
    .header p { margin: 4px 0 0 0; color: #666; }
    .tab-content { padding: 24px 0; }
    
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 16px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    
    .settings-list { display: flex; flex-direction: column; gap: 16px; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e0e0e0; }
    .setting-item:last-child { border-bottom: none; }
    .setting-info { flex: 1; }
    .setting-title { font-weight: 500; margin-bottom: 4px; }
    .setting-description { color: #666; font-size: 14px; }
    
    .config-status { margin-bottom: 16px; }
    .status-indicator { display: flex; align-items: center; gap: 8px; }
    .status-indicator.connected { color: #2e7d32; }
    .status-indicator.disconnected { color: #c62828; }
    
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .plan-item { text-align: center; }
    .plan-name { font-weight: 500; margin-bottom: 8px; color: #1976d2; }
    
    .backup-info { display: flex; flex-direction: column; gap: 16px; }
    .backup-item { display: flex; align-items: center; gap: 12px; }
    .backup-item mat-icon { color: #1976d2; font-size: 24px; }
    .backup-title { font-weight: 500; }
    .backup-date { color: #666; font-size: 14px; }
    
    mat-card { margin-bottom: 24px; }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .form-grid { grid-template-columns: 1fr; }
      .plans-grid { grid-template-columns: 1fr; }
      .setting-item { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `]
})
export class SettingsSimpleComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    console.log('SettingsSimpleComponent loaded');
  }
}