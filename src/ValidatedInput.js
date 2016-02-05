import React from 'react';
import { Input } from 'react-bootstrap';

export default class ValidatedInput extends React.Component {
    componentWillMount() {
        this.context.Validator.registerInput(this);
    }

    componentWillUnmount() {
        this.context.Validator.unregisterInput(this);
    }

    render() {
        const Validator = this.context.Validator;
        let {children as child, ...props} = this.props;

        props = Object.assign({}, child.props, props);

        if (typeof props.validationEvent === 'undefined') {
            props.validationEvent = Validator.validationEvent;
        }

        let name = props.name,
            error = Validator.hasError(name),
            origCallback = props[evtName];

        props[evtName] = (e) => {
            Validator.validateInput(name);

            return origCallback && origCallback(e);
        };

        if (name in Validator.model) {
            if (props.type === 'checkbox') {
                props.defaultChecked = Validator.model[name];
            } else {
                props.defaultValue = Validator.model[name];
            }
        }

        if (Validator.hasError(name)) {
            props.bsStyle = 'error';

            if (typeof error === 'string') {
                props.help = error;
            } else if (props.errorHelp) {
                props.help = props.errorHelp;
            }
        }

        return React.cloneElement(child, props);
    }
}

ValidatedInput.propTypes = Object.assign({}, Input.propTypes, {
    children       : React.PropTypes.node.isRequired,
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
