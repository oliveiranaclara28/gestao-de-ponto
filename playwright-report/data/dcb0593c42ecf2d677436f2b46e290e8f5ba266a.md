# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\fluxo-ponto.spec.ts >> Fluxo Completo do Ponto Certo (E2E) >> deve realizar login, acessar o painel e registrar o ponto
- Location: tests\tests\fluxo-ponto.spec.ts:5:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/dashboard"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/login"

```

```yaml
- region "Notifications alt+T"
- heading "Ponto Certo" [level=1]
- paragraph: Faça login para acessar o sistema
- text: "Erro 404: Not Found E-mail"
- textbox "seu.email@empresa.com": colaborador@pontocerto.com
- text: Senha
- textbox "••••••••": senha123
- button "Entrar"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Fluxo Completo do Ponto Certo (E2E)', () => {
  4  |   
  5  |   test('deve realizar login, acessar o painel e registrar o ponto', async ({ page }) => {
  6  |     // 1. Acessa a página de login do sistema
  7  |     await page.goto('http://localhost:3000/login');
  8  | 
  9  |     // 2. Preenche as credenciais (Lembre-se de usar um e-mail e senha válidos cadastrados no seu banco)
  10 |     await page.fill('input[type="email"]', 'colaborador@pontocerto.com');
  11 |     await page.fill('input[type="password"]', 'senha123');
  12 | 
  13 |     // 3. Clica no botão de entrar
  14 |     await page.click('button[type="submit"]');
  15 | 
  16 |     // 4. Valida se o login foi bem-sucedido e redirecionou para o dashboard
> 17 |     await expect(page).toHaveURL('http://localhost:3000/dashboard');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  18 |     await expect(page.locator('h1')).toContainText('Painel do Colaborador');
  19 | 
  20 |     // 5. Interage com a câmera / captura de ponto (se aplicável na tela)
  21 |     // O Playwright com os argumentos de fake device aprova a câmera automaticamente
  22 |     const botaoCapturar = page.locator('button:has-text("Capturar"), button:has-text("Tirar Foto")');
  23 |     if (await botaoCapturar.count() > 0) {
  24 |       await botaoCapturar.click();
  25 |     }
  26 | 
  27 |     // 6. Confirma o envio do registro de ponto
  28 |     const botaoEnviarPonto = page.locator('button:has-text("Registrar Ponto"), button:has-text("Confirmar")');
  29 |     if (await botaoEnviarPonto.count() > 0) {
  30 |       await botaoEnviarPonto.click();
  31 |     }
  32 | 
  33 |     // 7. Valida se apareceu uma mensagem de sucesso na tela
  34 |     await expect(page.locator('text=sucesso, text=registrado')).toBeVisible({ timeout: 5000 });
  35 |   });
  36 | 
  37 | });
```