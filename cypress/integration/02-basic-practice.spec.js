/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      const item = 'Good Attitude';
      cy.get('[data-test="new-item-input"]').type(item);
      cy.get('[data-test="add-item"]').click();
      cy.contains(item);

    });

    it('should put a new item in the "Unpacked Items" list', () => {
      const item = 'Good Attitude';
      cy.get('[data-test="new-item-input"]').type(item);
      cy.get('form').submit();

      cy.get('[data-test="items-unpacked"]').contains(item);
    });

    it('should put a new item as the last item in the "Unpacked Items" list', () => {
      const item = 'Good Attitude';
      cy.get('[data-test="new-item-input"]').type(item);
      cy.get('form').submit();
      
      cy.get('[data-test="items-unpacked"] li').last().contains(item);
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('Tooth');
      cy.contains('Tooth Brush');
      cy.contains('Tooth Paste');
      cy.get('[data-test="items"] li').each(($item) => {
        expect($item.text()).to.include('Tooth');
      })
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      cy.get('[data-test="filter-items"]').type('tooth');
      cy.contains('iPhone Charger').should('not.exist');
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get('[data-test="remove-all"]').click();

        cy.get('[data-test="items"] li').should('not.exist');
      });

      it('should remove all of the items (alternate)', () => {
        cy.get('[data-test="remove-all"]').click();

        cy.get('[data-test="items-unpacked"]').contains('No items to show.');
        cy.get('[data-test="items-packed"]').contains('No items to show.');
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => {
        cy.get('[data-test="items"] li').find('[data-test="remove"]')
      });

      it('should have a remove button on each item (literally)', () => {
        cy.get('[data-test="items"] li').each((li) => {
          cy.wrap(li).find('[data-test="remove"]').should('exist');
        })
      });

      it('should remove an item from the page', () => {
        cy.contains('Tooth Brush').parent().find('[data-test="remove"]').click();
        cy.contains('Tooth Brush').should('not.exist');
      });

      it('should remove an item from the page (alternative)', () => {
        cy.get('[data-test="items"] li').each($li => {
          cy.wrap($li).find('[data-test="remove"]').click();
          cy.wrap($li).should('not.exist');
        })
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      cy.get('[data-test="mark-all-as-unpacked"]').click();
      cy.get('[data-test="packed"] li').should('not.exist');
      cy.get('[data-test="items-packed"]').contains('No items to show.');
    });

    it('should empty have all of the items in the "Unpacked" list (better)', () => {
      cy.get('[data-test="items"] li')
      .its('length')
      .then((count) => {
        cy.get('[data-test="mark-all-as-unpacked"]').click()
        cy.get('[data-test="items-unpacked"] li').its('length').should('eq', count);
      })
    });
  });

  describe('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.get('[data-test="items-unpacked"]').contains('Tooth Brush').click()
      cy.get('[data-test="items-packed"]').contains('Tooth Brush').should('exist');
    });
  });
});
