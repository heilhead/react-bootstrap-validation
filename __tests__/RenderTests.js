'use strict';
import {ValidatedInput,Form, Radio, RadioGroup} from '../src';

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
      it('Renders ValidatedInput component correctly.', () => {
          // Render into document
          let validSubmit = function(event){};
          TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
            <ValidatedInput
              type='text'
              label='Email'
              name='email'
              validate='required,isEmail'
              errorHelp={{
                  required: 'Please enter your email',
                  isEmail: 'Email is invalid'
              }}
          />
            </Form>);
      });
      it('Renders RadioGroup component correctly.', () => {
          // Render into document
          let validSubmit = function(event){};
          TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
            <RadioGroup name='radio'
                       value='3'
                       label='Which one is better?'
                       validate={v => v === 'cola'}
                       errorHelp='Pepsi? Seriously?'
                       labelClassName='col-xs-2'
                       wrapperClassName='col-xs-10'>
               <Radio value='cola' label='Cola' />
               <Radio value='pepsi' label='Pepsi' />
           </RadioGroup>
            </Form>);
        });

});
