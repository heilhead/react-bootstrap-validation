import React from 'react';
import { Input } from 'react-bootstrap';

export default class ValidatedInput extends React.Component {
    componentDidMount() {
        this.context.Validator.register(this);
    }

    componentWillUnmount() {
        this.context.Validator.unregister(this);
    }

    getDefaultValue() {
        let key = 'defaultValue',
            value = this.context.Validator.getDefaultValue(this.props.name);

        if (this.props.type === 'checkbox') {
            key = 'defaultChecked';
        }

        return {key, value};
    }

    getValidation() {
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

    getValidatorProps() {
        let eventName = (this.props.validationEvent) ? this.props.validationEvent : this.context.Validator.validationEvent,
            {key, value} = this.getDefaultValue(),
            {bsStyle, help} = this.getValidation(),
            callback = (event) => {
                this.context.Validator.validate(this.props.name);

                return this.props[eventName] && this.props[eventName](event);
            },
            newProps = {
                validationEvent: eventName
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
                   {...this.getValidatorProps()}
                   ref="input">
                {this.props.children}
            </Input>
        );
    }
}

ValidatedInput.propTypes = Object.assign({}, Input.propTypes, {
    name           : React.PropTypes.string.isRequired,
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

ValidatedInput.defaultProps = Object.assign({}, Input.defaultProps, {
    validationEvent: ''
});
