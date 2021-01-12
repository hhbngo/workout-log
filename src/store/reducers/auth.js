import * as actionTypes from '../actions/actionTypes';
import { updateObject, parseError } from '../util';

const initialState = {
    token: null,
    userId: null,
    error: null,
    parsedError: null,
    loading: false
}

const authStart = (state) => updateObject(state, { loading: true, error: null, parsedError: null });
const clearError = (state) => updateObject(state, { error: null, parsedError: null });
const authSucces = (state, action) => updateObject(state, { token: action.data.idToken, userId: action.data.localId, loading: false });
const authFail = (state, action) => updateObject(state, { error: action.error, parsedError: parseError(action.error.message), loading: false });
const logout = (state) => updateObject(state, { token: null, userId: null, error: null, parsedError: null, loading: false });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state)
        case actionTypes.CLEAR_ERROR: return clearError(state)
        case actionTypes.AUTH_SUCCESS: return authSucces(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.LOG_OUT: return logout(state)
        default:
    }
    return state;
}

export default reducer;