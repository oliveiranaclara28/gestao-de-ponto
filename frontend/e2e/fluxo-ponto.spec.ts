import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação e Acesso ao Ponto Certo', () => {
  test('deve carregar a página de login e validar elementos do formulário', async ({ page }) => {
    // 1. Acessa a rota de login local
    await page.goto('http://localhost:3000/login');

    // 2. Valida se a marca e os campos de input essenciais estão visíveis
    await expect(page.locator('h2, h1')).toContainText(/Ponto Certo/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve impedir o avanço caso os campos de login estejam vazios', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Tenta submeter o formulário vazio
    await page.click('button[type="submit"]');

    // Confirma que o navegador reteve a rota de login por validação de campos obrigatórios
    await expect(page).toHaveURL(/.*login/);
  });
});