import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo do Ponto Certo (E2E)', () => {
  
  test('deve realizar login, acessar o painel e registrar o ponto', async ({ page }) => {
    // 1. Acessa a página de login do sistema
    await page.goto('http://localhost:3000/login');

    // 2. Preenche as credenciais (Lembre-se de usar um e-mail e senha válidos cadastrados no seu banco)
    await page.fill('input[type="email"]', 'colaborador@pontocerto.com');
    await page.fill('input[type="password"]', 'senha123');

    // 3. Clica no botão de entrar
    await page.click('button[type="submit"]');

    // 4. Valida se o login foi bem-sucedido e redirecionou para o dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Painel do Colaborador');

    // 5. Interage com a câmera / captura de ponto (se aplicável na tela)
    // O Playwright com os argumentos de fake device aprova a câmera automaticamente
    const botaoCapturar = page.locator('button:has-text("Capturar"), button:has-text("Tirar Foto")');
    if (await botaoCapturar.count() > 0) {
      await botaoCapturar.click();
    }

    // 6. Confirma o envio do registro de ponto
    const botaoEnviarPonto = page.locator('button:has-text("Registrar Ponto"), button:has-text("Confirmar")');
    if (await botaoEnviarPonto.count() > 0) {
      await botaoEnviarPonto.click();
    }

    // 7. Valida se apareceu uma mensagem de sucesso na tela
    await expect(page.locator('text=sucesso, text=registrado')).toBeVisible({ timeout: 5000 });
  });

});