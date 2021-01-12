import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Form from '../../components/Form/Form';

class Auth extends Component {
    state = {
        formFields: {
            email: {
                ElementType: 'input',
                config: {
                    type: 'email',
                    placeholder: 'Email',
                    required: true
                },
                value: ''
            },
            password: {
                ElementType: 'input',
                config: {
                    type: 'password',
                    placeholder: 'Password',
                    required: true
                },
                value: ''
            },
            confirmPassword: {
                ElementType: null,
                config: {
                    type: 'password',
                    placeholder: 'Confirm Password',
                    required: true
                },
                value: ''
            }
        },
        registerMode: false,
        loginMode: true,
        inputMissingError: null
    }

    inputChangeHandler = (event, name) => {
        const updatedCopy = {
            ...this.state.formFields,
            [name]: {
                ...this.state.formFields[name],
                value: event.target.value
            }
        };
        this.setState({ formFields: updatedCopy });
    }

    switchLoginRegister = () => {
        this.setState({
            registerMode: !this.state.registerMode,
            loginMode: !this.state.loginMode,
            formFields: { ...this.state.formFields, confirmPassword: { ...this.state.formFields.confirmPassword, ElementType: this.state.registerMode ? null : 'input' } },
            inputMissingError: null
        });
        this.props.onClearError();
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.setState({ inputMissingError: null });
        if (this.state.formFields.email.value.length === 0 || this.state.formFields.password.value.length === 0) {
            return this.setState({ inputMissingError: this.state.formFields.email.value.length === 0 ? 'Please enter an email' : 'Please enter a password' })
        }
        this.props.onAuth(
            this.state.loginMode,
            this.state.formFields.email.value,
            this.state.formFields.password.value,
            this.props.history
        );
    }

    render() {
        let passwordMatchError = null
        if (this.state.registerMode && this.state.formFields.password.value !== this.state.formFields.confirmPassword.value) passwordMatchError = 'Passwords do not match'

        const formConfig = {
            formTitle: this.state.registerMode ? 'Register' : 'Sign In',
            btnText: this.state.registerMode ? 'Submit' : 'Login',
            optionText: this.state.registerMode ? 'Switch to login →' : 'Need an account? Register →',
            error: this.state.inputMissingError ? this.state.inputMissingError : this.props.errorMessage,
            error2: passwordMatchError
        }
        return (
            <div>
                <Form
                    fields={this.state.formFields}
                    loading={this.props.loading}
                    inputChanged={this.inputChangeHandler}
                    optionClicked={this.switchLoginRegister}
                    buttonClicked={this.onSubmitHandler}
                    config={formConfig} />
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        authError: state.auth.error,
        errorMessage: state.auth.parsedError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (loginMode, email, password, history) => dispatch(actions.auth(loginMode, email, password, history)),
        onClearError: () => dispatch(actions.clearError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth));