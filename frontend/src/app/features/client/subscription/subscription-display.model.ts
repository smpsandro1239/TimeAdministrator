// c:/laragon/www/TimeAdministrator/frontend/src/app/features/client/subscription/subscription-display.model.ts

/**
 * Define a estrutura para um item de informação a ser exibido no cartão de subscrição.
 */
export interface SubscriptionDisplayItem {
  label: string;
  value: string | number | Date;
  isDate?: boolean;
}