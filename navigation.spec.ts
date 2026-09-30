import {test,expect} from '@playwright/test';
test('topic library supports search, lessons, refresh and browser navigation',async({page},info)=>{
 await page.goto('/');await page.getByRole('button',{name:'Explorar os assuntos',exact:true}).click();await expect(page).toHaveURL(/#\/library$/);
 await page.getByLabel('Filtrar assuntos por unidade').selectOption('4');await page.getByLabel('Buscar assunto').fill('7S');await expect(page.locator('.topic-card')).toHaveCount(1);
 await page.getByRole('link',{name:'Pular para o conteúdo'}).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#\/library$/);
 await page.getByRole('button',{name:/Estudar .*7S/}).click();await expect(page.getByRole('heading',{name:'O conceito',exact:true})).toBeVisible();await expect(page.locator('.option')).toHaveCount(0);
 await page.reload();await expect(page.getByRole('heading',{name:'O conceito',exact:true})).toBeVisible();await page.goBack();await expect(page.getByLabel('Buscar assunto')).toBeVisible();
 await page.getByLabel('Buscar assunto').fill('assunto inexistente');await expect(page.getByRole('heading',{name:'Nenhum assunto encontrado'})).toBeVisible();await page.getByRole('button',{name:'Ver todos os assuntos'}).click();await expect(page.locator('.topic-card')).toHaveCount(46);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 if(info.project.name==='mobile'){const tabs=page.getByRole('navigation',{name:'Navegação principal no celular'});await expect(tabs).toBeVisible();await tabs.getByRole('button',{name:'Revisar',exact:true}).click();await expect(page.getByRole('heading',{name:'Nenhum erro pendente'})).toBeVisible();await tabs.getByRole('button',{name:'Início',exact:true}).click();await expect(page.getByRole('heading',{name:'Vamos avançar?'})).toBeVisible()}
});
