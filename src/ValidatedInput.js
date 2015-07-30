import React from 'react';
import { Input } from 'react-bootstrap';

export default class ValidatedInput extends Input {
    constructor(props) {
        super(props);

        if (!props._registerInput || !props._unregisterInput) {
            throw new Error('Input must be placed inside the Form component');
        }
    }

    componentWillMount() {
        if (super.componentWillMount) {
            super.componentWillMount();
        }

        this.props._registerInput(this);
    }

    componentWillUnmount() {
        if (super.componentWillUnmount) {
            super.componentWillUnmount();
        }

        this.props._unregisterInput(this);
    }
}

ValidatedInput.propTypes = Object.assign({}, Input.propTypes, {
    name: React.PropTypes.string.isRequired,
    validate : React.PropTypes.oneOfType([
        React.PropTypes.func,
        React.PropTypes.string
    ]),
    errorHelp: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
    ])
});
