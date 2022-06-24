///<reference types="cypress" />

describe('Contact us form', () => {
    before(function () {
        cy.fixture('contactUsForm').as("data")
    })
    it('TC01: Happy path: all mandatory fields filled', () => {
        cy.visit('')
        cy.get('a[href$="contact"]').click();
        cy.get('@data').then((data) => {
            cy.get('#ContactUsFrm_first_name').clear().type(data[0].name);
            cy.get('#ContactUsFrm_email').clear().type(data[0].email);
            cy.get('#ContactUsFrm_enquiry').clear().type(data[0].enquiry);
        });
        cy.get('button[title="Submit"]').click();
        cy.url().should('contain', 'success');
        cy.get('div.contentpanel p').should('have.text', 'Your enquiry has been successfully sent to the store owner!')
    });
});