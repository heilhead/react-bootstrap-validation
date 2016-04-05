'use strict';
import Form from '../src/Form';

// Note: THere is an issue with react-bootstrap and mocking. For now the whole node_modules directory has been unmocked.
describe('React bootstrap validation compilation test', () => {
    var React = require('react');
    var TestUtils = require('react-addons-test-utils');

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
});
