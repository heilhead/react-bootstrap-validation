import React from 'react';

import InputContainer from './InputContainer';
import ValidatedInput from './ValidatedInput';
import RadioGroup from './RadioGroup';
import Validator from './Validator';
import FileValidator from './FileValidator';
import createFragment from 'react-addons-create-fragment'

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
                getDefaultValue: this._getDefaultValue.bind(this),
                hasError: this._hasError.bind(this),
                register: this.registerInput.bind(this),
                unregister: this.unregisterInput.bind(this),
                validate: this._validateInput.bind(this),
                validationEvent: this.props.validationEvent
            }
        };
    }

    componentWillMount() {
        super.componentWillMount();

        this._validators = {};
    }

    registerInput(input) {
        super.registerInput(input);

        if (typeof input.props.validate === 'string') {
            this._validators[input.props.name] = this._compileValidationRules(input, input.props.validate);
        }
    }

    unregisterInput(input) {
        super.unregisterInput(input);

        delete this._validators[input.props.name];
    }

    render() {
        const {
            children,
            errorHelp,
            model,
            onValidSubmit,
            onInvalidSubmit,
            validateOne,
            validateAll,
            validationEvent,
            ...props
        } = this.props;

        return (
            <form ref="form"
                  onSubmit={this._handleSubmit.bind(this)}
                  method={this.props.method}
                  action="#"
                  {...props}>
                {this.props.children}
            </form>
        );
    }

    getValues() {
        return Object.keys(this._inputs).reduce((values, name) => {
            values[name] = this._getValue(name);

            return values;
        }, {});
    }

    submit() {
        this._handleSubmit();
    }

    _validateInput(name) {
        this._validateOne(name, this.getValues());
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

         if (typeof validate === 'function') {
            result = validate(value, context);
        } else if (typeof validate === 'string') {
            result = this._validators[iptName](value);
        } else {
            result = true;
        }

		if (typeof this.props.validateOne === 'function') {
            result = this.props.validateOne(iptName, value, context, result);
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

    _getDefaultValue(iptName) {
        if (iptName in this.props.model) {
            return this.props.model[iptName];
        }
    }

    _getValue(iptName) {
        let input = this._inputs[iptName];

        if (Array.isArray(input)) {
            console.warn('Multiple inputs use the same name "' + iptName + '"');

            return false;
        }

        return input.getValue();
    }

    _handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        let values = this.getValues();

        let { isValid, errors } = this._validateAll(values);

        if (isValid) {
            this.props.onValidSubmit(values);
        } else {
            this.props.onInvalidSubmit(errors, values);
        }
    }
}

Form.childContextTypes = {
    Validator: React.PropTypes.object.isRequired
};


Form.propTypes = {
    className      : React.PropTypes.string,
    model          : React.PropTypes.object,
    method         : React.PropTypes.oneOf(['get', 'post']),
    onValidSubmit  : React.PropTypes.func.isRequired,
    onInvalidSubmit: React.PropTypes.func,
    validateOne    : React.PropTypes.func,
    validateAll    : React.PropTypes.func,
    validationEvent: React.PropTypes.oneOf([
        'onChange', 'onBlur', 'onFocus'
    ]),
    errorHelp      : React.PropTypes.node
};

Form.defaultProps = {
    model          : {},
    validationEvent: 'onChange',
    method         : 'get',
    onInvalidSubmit: () => {}
};
