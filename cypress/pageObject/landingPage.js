class landingPage {
    _cartPageSelector = "#main_menu_top a[href$='checkout/cart']"
    _productSelector = 'a.prdocutname'
    _addToCartIcon = "i.fa-cart-plus"

    goToTheCartPage () {
        return cy.get(this._cartPageSelector).click({force:true});
    }

    goToTheFirstProductsPage () {
        return cy.get(this._productSelector).eq(0).click();
    }

    addFirstItemToTheCart () {
        return cy.get(this._addToCartIcon).eq(0).scrollIntoView().click();
    }
}


export default landingPage;