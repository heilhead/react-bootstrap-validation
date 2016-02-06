import React from 'react';
import { Input } from 'react-bootstrap';

export default class ValidatedInput extends React.Component {
    componentWillMount() {
        this.context.Validator.registerInput(this);
    }

    componentWillUnmount() {
        this.context.Validator.unregisterInput(this);
    }

    getValue() {
        let value;

        if (this.props.type === 'checkbox') {
        value = this.refs.input.getChecked();
        } else if (this.props.type === 'file') {
            value = this.refs.input.getInputDOMNode().files;
        } else {
            value = this.refs.input.getValue();
        }

        return value;
    }

    render() {
        let {validate, errorHelp, validationEvent, ...props} = this.props;

        return (
            <Input {...props}
                {...this._generateValidatorProps()}
                ref='input'>
                {this.props.children}
            </Input>
        )
    }

    _generateValidatorProps() {
        let eventName = this._getValidationEvent(),
            {key, value} = this._getDefaultValue(),
            {bsStyle, help} = this._getValidation(),
            callback = this._getValidationCallback(eventName),
            newProps = {
                validationEvent: eventName,
            };

        newProps[eventName] = callback;

        if (value) {
            newProps[key] = value;
        }

        if (bsStyle) {
            newProps.bsStyle = bsStyle;
        }

        if (help) {
            newProps.help = help;
        }

        return newProps;
    }

    _getValidationEvent() {
        return (this.props.validationEvent) ? this.props.validationEvent : this.context.Validator.validationEvent;
    }

    _getValidationCallback(eventName) {
        let origCallback = this.props[eventName];

        return (event) => {
            this.context.Validator.validateInput(this.props.name, this.getValue());

            return origCallback && origCallback(event);
        };
    }

    _getDefaultValue() {
        let key = 'defaultValue',
            value = this.context.Validator.getDefaultValue(this.props.name);

        if (this.props.type === 'checkbox') {
            key = 'defaultChecked';
        }

        return {key, value};
    }

    _getValidation() {
        let error = this.context.Validator.hasError(this.props.name),
            bsStyle = false,
            help = false;

        if (error) {
            bsStyle = 'error';

            if (typeof error === 'string') {
                help = error;
            } else if (this.props.errorHelp) {
                help = this.props.errorHelp;
            }
        }

        return {bsStyle, help};
    }
}

ValidatedInput.propTypes = Object.assign({}, Input.propTypes, {
    validationEvent: React.PropTypes.oneOf([
        '', 'onChange', 'onBlur', 'onFocus'
    ]),
    validate       : React.PropTypes.oneOfType([
        React.PropTypes.func,
        React.PropTypes.string
    ]),
    errorHelp      : React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ])
});

ValidatedInput.contextTypes = {
    Validator: React.PropTypes.object.isRequired
};

ValidatedInput.defaultProps = Input.defaultProps;
