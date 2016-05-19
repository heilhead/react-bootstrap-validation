'use strict';
import Form from '../src/Form';

// Note: THere is an issue with react-bootstrap and mocking. For now the whole node_modules directory has been unmocked.
describe('React bootstrap validation compilation test', () => {
    var React = require('react');
    var TestUtils = require('react-addons-test-utils');
    var validator = require('validator');

    beforeEach(function() {

    });

    it('Renders Form component correctly.', () => {
        // Render into document
        TestUtils.renderIntoDocument(<div></div>);
        TestUtils.renderIntoDocument(
          <Form onValidSubmit={ function(event)
                {
                  // Do some work with the validation outcomes
                }
              } />);
    });

    it('Renders Form with validation library as prop.', () => {
        // Assemble
        var form = TestUtils.renderIntoDocument(
            <Form validator={validator} onValidSubmit={ function(event) {return true;} } />
         );
    });

    it('Form validation has custom validation rule.', () => {
        // Assemble
        var form = TestUtils.renderIntoDocument(
            <Form validator={validator} onValidSubmit={ function(event) {return true;} } />
        );
         validator.extend('isTrue', val => { return true; });

         expect(form.props.validator.isTrue()).toBe(true);
    });
});
