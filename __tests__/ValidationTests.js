'use strict';
import Form from '../src/Form';
import ValidatedInput from '../src/ValidatedInput';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// Note: There is an issue with react-bootstrap and mocking. For now the whole node_modules directory has been unmocked.
describe('React bootstrap validation compilation test', () => {
    var React = require('react');
    var TestUtils = require('react-addons-test-utils');

    beforeEach(function() {

    });

    it('Calls onValidSubmit when input is valid', () => {
        const spy = sinon.spy(), invalidSpy = sinon.spy();
        const form = mount(
            <Form onValidSubmit={spy} onInvalidSubmit={invalidSpy}>
                <ValidatedInput name='foo' type='text' value='bar'></ValidatedInput>
            </Form>
        );

        form.simulate('submit');

        expect(spy.calledOnce).to.equal(true);
        expect(invalidSpy.called).to.equal(false);
    });

    it('Calls onInvalidSubmit when input is not valid', () => {
        const spy = sinon.spy(), invalidSpy = sinon.spy();
        const form = mount(
            <Form onValidSubmit={invalidSpy} onInvalidSubmit={spy}>
                <ValidatedInput name='foo' type='text' validate='required' value=''></ValidatedInput>
            </Form>
        );

        form.simulate('submit');

        expect(spy.calledOnce).to.equal(true);
        expect(invalidSpy.called).to.equal(false);
    });

    it('Validates a checkbox', () => {
        const spy = sinon.spy(), invalidSpy = sinon.spy();
        const form = mount(
            <Form onValidSubmit={spy} onInvalidSubmit={invalidSpy}>
                <ValidatedInput type='checkbox' name='agree' checked={true} label='I agree to the terms and conditions' validate='isChecked'/>
            </Form>
        );

        form.simulate('submit');

        expect(spy.calledOnce).to.equal(true);
        expect(invalidSpy.called).to.equal(false);
    });

    it('Validates a file input', () => {
        const spy = sinon.spy(), invalidSpy = sinon.spy();
        const form = mount(
            <Form onValidSubmit={spy} onInvalidSubmit={invalidSpy}>
                <ValidatedInput name='file' type='file' label='Attachments' multiple/>
            </Form>
        );

        form.simulate('submit');

        expect(spy.calledOnce).to.equal(true);
        expect(invalidSpy.called).to.equal(false);
    });
});
