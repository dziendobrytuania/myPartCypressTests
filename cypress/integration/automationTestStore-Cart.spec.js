/// <reference types="cypress" />
import landingPage from "../pageObject/landingPage.js";
const landing = new landingPage();

describe("Cart tests: Quantity and product name on the cart page", () => {
    beforeEach('Visit landing page', () => {
        cy.visit('');
    });

    it("TC01: There are no items on the cart page by the default", () => {
        landing.goToTheCartPage();
        cy.get('.contentpanel').should('contain', 'Your shopping cart is empty')
        cy.get('div[class$="cart-info product-list"]').should('not.exist')
    })


    it("TC02: Add an item to the cart via the product page and validate it's name on the cart page", () => {
        landing.goToTheFirstProductsPage().then(function (productName) {
            cy.get('.cart').click();
            landing.goToTheCartPage();
            cy.get('tbody').eq(0).should('contain', productName.text());
        });

    })

    it("TC03: Add an item to the cart via the product page and validate the quantity on the cart page", () => {
        landing.goToTheCartPage();
        cy.get('.contentpanel').should('contain', 'Your shopping cart is empty')
        cy.go('back')
        landing.goToTheFirstProductsPage()
        cy.get('.cart').click();
        landing.goToTheCartPage();
        cy.get('div[class$="cart-info product-list"]').should('exist')
        cy.get('input[id*="quantity"]').should('have.value', '1');
    })

    it("TC04: Add an item to the cart via the home page and validate the quantity on the cart page", () => {
        landing.goToTheCartPage();
        cy.get('.contentpanel').should('contain', 'Your shopping cart is empty')
        cy.go('back').wait(1000)
        landing.addFirstItemToTheCart().wait(3000).then(() => {
            landing.goToTheCartPage();
        cy.get('div[class$="cart-info product-list"]').should('exist')
        cy.get('input[id*="quantity"]').should('have.value', '1');
        })    
    })

})


describe("Cart tests: Quantity next to the cart icon", () => {
    beforeEach('Visit landing page', () => {
        cy.visit('');
        cy.get('a[href$="checkout/cart"] span.label').as('homePageCart')
    });

    it("TC05: There are no items in the cart on the home page", () => {
        cy.get('@homePageCart').should('contain', '0');
    })


    it("TC06: Add an item to the cart via the product page and validate the quantity in the cart on the home page", () => {
        landing.goToTheFirstProductsPage();
        cy.get('.cart').click();
        cy.get('@homePageCart').should('contain', '1');
    })

    it("TC07: Add an item to the cart via the home page and validate the quantity in the cart on the home page", () => {
        landing.addFirstItemToTheCart().wait(3000).then(() => {
            cy.get('@homePageCart').should('contain', '1');
        })    
        
    })

})

describe("Cart tests: Price on the cart page and next to the cart icon", () => {
    beforeEach('Visit landing page', () => {
        cy.visit('');
        cy.get('a[href$="checkout/cart"] span.label').as('homePageCart')
        landing.addFirstItemToTheCart()
    });

    it("TC08: Add a product to the cart and validate the price on the cart page", () => {
        cy.get('.oneprice').eq(0).then(function (price) {
            landing.goToTheCartPage();
            cy.get('tbody > :nth-child(2) > :nth-child(4)').should('contain', price.text());
            cy.get('tbody > :nth-child(2) > :nth-child(6)').should('contain', price.text());
            cy.get(':nth-child(1) > :nth-child(2) > .bold').should('contain', price.text());
        });
    })

    it("TC09: Add a product to the cart and validate the price next to the cart icon", () => {
        cy.get('.oneprice').eq(0).then(function (price) {
            cy.get('.cart_total').should('contain', price.text())
            cy.get('.cart_block_total').should('contain', price.text())
        });
    })

    it("TC10:Add an item to the cart and validate that total price on the cart page includes shipping rate", () => {
        landing.goToTheCartPage();
        cy.get(':nth-child(1) > :nth-child(2) > .bold').invoke('text').as('subTotalPrice')
        cy.get('@subTotalPrice').then(function (price) {
            let itemPriceSplit = price.split('$')
            let singleItemPrice = Number(itemPriceSplit[1])
            cy.log('This is subtotal price ' + singleItemPrice)
            cy.get(':nth-child(2) > :nth-child(2) > .bold').invoke('text').as('shippingPrice')
            cy.get('@shippingPrice').then(function (shippingPrice) {
                let shippingPriceSplit = shippingPrice.split('$')
                let shippingPriceValue = Number(shippingPriceSplit[1])
                cy.log('Shipping rate: ' + shippingPriceValue)

                let totalPrice = singleItemPrice+shippingPriceValue
                cy.log('A total price:  '+totalPrice)
                expect(totalPrice).not.to.equal(singleItemPrice)
                cy.wrap(totalPrice).should('be.gt', singleItemPrice)
            })
        });
    })

    it("TC11: Change the quantity of products in the car and validate that it results in a new total price", () => {
        landing.goToTheCartPage();
        cy.get('tbody > :nth-child(2) > :nth-child(6)').invoke('text').as('oldTotalPrice')
        cy.get('@oldTotalPrice').then(function(oldTotalPrice) {
            let oldTotalPriceSplit = oldTotalPrice.split('$')
            let oldTotalPriceValue = Number(oldTotalPriceSplit[1])
            cy.log('The old total price: ' + oldTotalPriceValue)

            cy.get('#cart_quantity50').clear().type('12')
            cy.get('#cart_update').click()
            cy.get('tbody > :nth-child(2) > :nth-child(6)').invoke('text').as('newTotalPrice')
            cy.get('@newTotalPrice').then(function(newTotalPrice) {
                let newTotalPriceSplit = newTotalPrice.split('$')
                let newTotalPriceValue = Number(newTotalPriceSplit[1])
                cy.log('The old total price: ' + newTotalPriceValue)
                expect(oldTotalPrice).not.to.equal(newTotalPrice)
                cy.wrap(oldTotalPriceValue).should('be.lt', newTotalPriceValue)
                cy.get(':nth-child(1) > :nth-child(2) > .bold').invoke('text').should('eq', newTotalPrice)
                expect(newTotalPriceValue/12).to.equal(oldTotalPriceValue)

            })
        })
    })

    it("TC12: Change the quantity of products in the cart and validate that it does not affect the unit price", () => {
        landing.goToTheCartPage();
        cy.get('tbody > :nth-child(2) > :nth-child(4)').invoke('text').as('oldUnitPrice')
        cy.get('@oldUnitPrice').then((oldUnitPrice) => {
            cy.log('The old unit price: '+ oldUnitPrice)
            cy.get('#cart_quantity50').clear().type('12')
            cy.get('#cart_update').click()
            cy.get('tbody > :nth-child(2) > :nth-child(4)').invoke('text').as('newUnitPrice')
            cy.get('@newUnitPrice').should('eq', oldUnitPrice)
        })
    })
})

