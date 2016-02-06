import React from 'react';
import InputContainer from './InputContainer';
import ValidatedInput from './ValidatedInput';
import RadioGroup from './RadioGroup';

import Validator from './Validator';
import FileValidator from './FileValidator';

function getInputErrorMessage(input, ruleName) {
    let errorHelp = input.props.errorHelp;

    if (typeof errorHelp === 'object') {
        return errorHelp[ruleName];
    } else {
        return errorHelp;
    }
}

export default class Form extends InputContainer {
    constructor(props) {
        super(props);

        this.state = {
            isValid: true,
            invalidInputs: {}
        };
    }

    getChildContext() {
        return {
            Validator: {
                getValue: this._getValue.bind(this),
                hasError: this._hasError.bind(this),
                registerInput: this.registerInput.bind(this),
                unregisterInput: this.unregisterInput.bind(this),
                updateInput: this._updateInput.bind(this),
                validateInput: this._validateInput.bind(this),
                validationEvent: this.props.validationEvent
            }
        };
    }

    componentWillMount() {
        super.componentWillMount();

        this._validators = {};
        this._values = {};
    }

    getValues() {
        return Object.keys(this._inputs).reduce((values, name) => {
            values[name] = this._getValue(name);

            return values;
        }, {});
    }

    registerInput(input) {
        super.registerInput(input);

        if (typeof input.props.validate === 'string') {
            this._validators[input.props.name] = this._compileValidationRules(input, input.props.validate);
            this._values[input.props.name] = this._getValue(input.props.name);
        }
    }

    submit() {
        this._handleSubmit();
    }

    unregisterInput(input) {
        super.unregisterInput(input);

        delete this._validators[input.props.name];
    }

    render() {
        return (
            <form action="#"
                  className={this.props.className}
                  onSubmit={this._handleSubmit.bind(this)}>
                {this.props.children}
            </form>
        );
    }

    _compileValidationRules(input, ruleProp) {
        let rules = ruleProp.split(',').map(rule => {
            let params = rule.split(':');
            let name = params.shift();
            let inverse = name[0] === '!';

            if (inverse) {
                name = name.substr(1);
            }

            return { name, inverse, params };
        });

        let validator = (input.props && input.props.type) === 'file' ? FileValidator : Validator;

        return val => {
            let result = true;

            rules.forEach(rule => {
                if (typeof validator[rule.name] !== 'function') {
                    throw new Error('Invalid input validation rule "' + rule.name + '"');
                }

                let ruleResult = validator[rule.name](val, ...rule.params);

                if (rule.inverse) {
                    ruleResult = !ruleResult;
                }

                if (result === true && ruleResult !== true) {
                    result = getInputErrorMessage(input, rule.name) ||
                        getInputErrorMessage(this, rule.name) || false;
                }
            });

            return result;
        };
    }

    _getValue(iptName) {
        let input = this._inputs[iptName],
            value;

        if (Array.isArray(input)) {
            console.warn('Multiple inputs use the same name "' + iptName + '"');

            return null;
        }

        if (iptName in this.props.model) {
            value = this.props.model[iptName];
        }

        if (this._values[iptName]) {
            value = this._values[iptName];
        }

        return value;
    }

    _handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        let { isValid, errors } = this._validateAll(this._values);

        if (isValid) {
            this.props.onValidSubmit(this._values);
        } else {
            this.props.onInvalidSubmit(errors, this._values);
        }
    }

    _hasError(iptName) {
        return this.state.invalidInputs[iptName];
    }

    _setError(iptName, isError, errText) {
        if (isError && errText &&
            typeof errText !== 'string' &&
            typeof errText !== 'boolean')
        {
            errText = errText + '';
        }

        // set value to either bool or error description string
        this.setState({
            invalidInputs: Object.assign(
                this.state.invalidInputs,
                {
                    [iptName]: isError ? errText || true : false
                }
            )
        });
    }

    _updateInput(name, value) {
        this._values[name] = value;
    }

    _validateAll(context) {
        let isValid = true;
        let errors = [];

        if (typeof this.props.validateAll === 'function') {
            let result = this.props.validateAll(context);

            if (result !== true) {
                isValid = false;

                Object.keys(result).forEach(iptName => {
                    errors.push(iptName);

                    this._setError(iptName, true, result[iptName]);
                });
            }
        } else {
            Object.keys(this._inputs).forEach(iptName => {
                if (!this._validateOne(iptName, context)) {
                    isValid = false;
                    errors.push(iptName);
                }
            });
        }

        return {
            isValid: isValid,
            errors: errors
        };
    }

    _validateInput(name) {
        this._validateOne(name, this._values);
    }

    _validateOne(iptName, context) {
        let input = this._inputs[iptName];

        if (Array.isArray(input)) {
            console.warn('Multiple inputs use the same name "' + iptName + '"');

            return false;
        }

        let value = context[iptName];
        let isValid = true;
        let validate = input.props.validate;
        let result, error;

        if (typeof this.props.validateOne === 'function') {
            result = this.props.validateOne(iptName, value, context);
        } else if (typeof validate === 'function') {
            result = validate(value, context);
        } else if (typeof validate === 'string') {
            result = this._validators[iptName](value);
        } else {
            result = true;
        }

        // if result is !== true, it is considered an error
        // it can be either bool or string error
        if (result !== true) {
            isValid = false;

            if (typeof result === 'string') {
                error = result;
            }
        }

        this._setError(iptName, !isValid, error);

        return isValid;
    }
}

Form.propTypes = {
    className      : React.PropTypes.string,
    model          : React.PropTypes.object,
    onValidSubmit  : React.PropTypes.func.isRequired,
    onInvalidSubmit: React.PropTypes.func,
    validateOne    : React.PropTypes.func,
    validateAll    : React.PropTypes.func,
    validationEvent: React.PropTypes.oneOf([
        'onChange', 'onBlur', 'onFocus'
    ]),
    errorHelp      : React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ])
};

Form.defaultProps = {
    model          : {},
    validationEvent: 'onChange',
    onInvalidSubmit: () => {}
};

Form.childContextTypes = {
    Validator: React.PropTypes.object.isRequired
};

