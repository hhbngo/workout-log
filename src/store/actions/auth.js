import * as actionTypes from './actionTypes';
import { resetExercises } from './home';
import axios from 'axios';

const { REACT_APP_FIREBASE_API_KEY } = process.env;

const clearError = () => {
    return {
        type: actionTypes.CLEAR_ERROR
    }
}

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

const authSucces = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        data: authData
    }
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
};

const logoutUser = () => {
    return {
        type: actionTypes.LOG_OUT
    }
}

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return dispatch => {
        dispatch(logoutUser());
        dispatch(resetExercises());
    }
}

const auth = (loginMode, email, password, history) => {
    return dispatch => {
        dispatch(authStart());
        const authInfo = {
            email,
            password,
            returnSecureToken: true
        };
        axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sign${loginMode ? 'InWithPassword' : 'Up'}?key=${REACT_APP_FIREBASE_API_KEY}`, authInfo)
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.localId);
                dispatch(authSucces(res.data));
                history.push('/home');
                dispatch(checkAuthTimeout(res.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    }
};

const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate >= new Date()) {
                dispatch(authSucces({
                    idToken: token,
                    localId: localStorage.getItem('userId')
                }));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        } else dispatch(logout());
    }
}


export { auth, clearError, logout, authCheckState };