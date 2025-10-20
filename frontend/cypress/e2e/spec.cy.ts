
const adressMail = Math.floor(Math.random() * 100);


describe('My First Test', () => {
  it('should go on the site', () => {
cy.visit('http://localhost:4200')
cy.get('a').click();
cy.get('#firstname').click();
cy.get('#firstname').type('robin');
cy.get('#lastname').type('Fantino');
cy.get('#email').type(`${adressMail}@gmail.com`);
cy.get('div.page-content').click();
cy.get('#password').type(`Ploplop/350!`).press(Cypress.Keyboard.Keys.ESC);
cy.get('#confirm-password').type('Ploplop/350!').press(Cypress.Keyboard.Keys.ESC);
cy.get('#ny').check();
cy.get('span.p-button-label').click();
cy.wait(2000)
cy.get('#email').type(`${adressMail}@gmail.com`);
cy.get('#password').type('Ploplop/350!');
cy.get('button.p-ripple').click();
cy.get('button.create-home').click();
cy.get('#homeName').click();
cy.get('#homeName').type('bras cassé en deux');
cy.get('button[pc47] span.p-button-label').click();
cy.get('#search-bar [name="undefined"]').click();
cy.get('#search-bar [name="undefined"]').type('pom');
cy.wait(2000)
cy.get('#pn_id_8_0').click().press(Cypress.Keyboard.Keys.ESC);
cy.wait(2000)
cy.get('#fav').click({force: true});
cy.wait(2000)
cy.get('#navbare i.pi-heart-fill').click({force: true});
cy.wait(1000)
cy.get('#pn_id_2-table i.pi').click({force: true});
cy.wait(1000)
cy.get('#navbare li:nth-child(5) h3').click({force: true});
cy.wait(1000)
cy.get('i.pi-plus').click({force: true});
cy.wait(1000)
cy.get('#name').click({force: true});
cy.wait(1000)
cy.get('#name').type('courses');
cy.wait(1000)
cy.get('div.dialog-button-container button:nth-child(1)').click({force: true});
cy.wait(1000)
cy.get('a.cart-list-item').click({force: true});
cy.wait(1000)
cy.get('#search-bar [name="undefined"]').click({force: true});
cy.wait(1000)
cy.get('#search-bar [name="undefined"]').type('me');
cy.wait(1000)
cy.get('#pn_id_20_0 span.ng-star-inserted').click({force: true});
cy.wait(1000)
cy.get('main').click({force: true});
cy.wait(1000)
cy.reload();
cy.wait(1000)
cy.get('#navbare div.navbare-user li:nth-child(2) button.navbare_button').click();
  })
})
