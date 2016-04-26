'use strict';
import {ValidatedInput,Form} from '../src';

// Note: THere is an issue with react-bootstrap and mocking. For now the whole node_modules directory has been unmocked.
describe('React bootstrap ValidatedInput test', () => {
    var React = require('react');
    var TestUtils = require('react-addons-test-utils');
    beforeEach(function() {
    });
    it('Validates a number with minimum.', () => {
          // Render into document
          var submittedObject = null;
          var validSubmit = function(event){
            submittedObject = event;
          };

          let item = TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
              <ValidatedInput
              type='text'
              label='Number'
              name='number'
              className='testInput'
              validate={[{
                          "name"  :"isInt",
                          "params": { "min": 10, "max": 99 },
                          "condition": "and"
                        }]}
              errorHelp={{
                  isInt: 'Must be a whole number'
              }}
              />
            </Form>);

            let input = TestUtils.scryRenderedDOMComponentsWithClass(item, 'testInput')[1];
            input.value='not a number';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject).toBe(null);

            input.value='9';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject).toBe(null);

            input.value='19';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject.number).toBe('19');


    });

    it('Validates an empty field.', () => {
          // Render into document
          var submittedObject = null;
          var validSubmit = function(event){
            submittedObject = event;
          };

          let item = TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
              <ValidatedInput
              type='text'
              label='Email'
              name='email'
              className='testInput'
              validate='isEmpty'
              errorHelp={{
                  isEmail: 'Must be an email'
              }}
              />
            </Form>);

            let input = TestUtils.scryRenderedDOMComponentsWithClass(item, 'testInput')[1];
            input.value='aaaa';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject).toBe(null);
            input.value='';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject.email).toBe('');
    });

    it('Validates a number.', () => {
          // Render into document
          var submittedObject = null;
          var validSubmit = function(event){
            submittedObject = event;
          };

          let item = TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
              <ValidatedInput
              type='text'
              label='Number'
              name='number'
              className='testInput'
              validate='required,isInt'
              errorHelp={{
                  required: 'Please enter a number',
                  isInt: 'Must be a whole number'
              }}
              />
            </Form>);

            let input = TestUtils.scryRenderedDOMComponentsWithClass(item, 'testInput')[1];
            input.value='not a number';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject).toBe(null);

            input.value='23';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject.number).toBe('23');
    });

    it('Validates an email.', () => {
          // Render into document
          var submittedObject = null;
          var validSubmit = function(event){
            submittedObject = event;
          };

          let item = TestUtils.renderIntoDocument(
            <Form onValidSubmit={validSubmit}>
              <ValidatedInput
              type='text'
              label='Email'
              name='email'
              className='testInput'
              validate='required,isEmail'
              errorHelp={{
                  required: 'Please enter your email',
                  isEmail: 'Email is invalid'
              }}
              />
            </Form>);

            let input = TestUtils.scryRenderedDOMComponentsWithClass(item, 'testInput')[1];
            input.value='notavlidaemailaddress';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            // test for error messages next to the item
            expect(submittedObject).toBe(null);

            input.value='test@nowhere.com';
            TestUtils.Simulate.change(input);
            TestUtils.Simulate.submit(item.refs.form);
            console.log(submittedObject);
            expect(submittedObject.email).toBe('test@nowhere.com');
    });

});
