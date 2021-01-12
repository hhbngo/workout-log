import * as actionTypes from './actionTypes';
import axios from 'axios';
const BASE_URL = 'https://workout-log-f70d8-default-rtdb.firebaseio.com';

export const setExercises = (exercises) => {
    return {
        type: actionTypes.SET_EXERCISES,
        data: exercises
    }
}

export const addExercise = (e, b, key) => {
    return {
        type: actionTypes.ADD_EXERCISE,
        payload: { e, b, key }
    }
}

const removeExercise = (key) => {
    return {
        type: actionTypes.REMOVE_EXERCISE,
        key
    }
}

export const resetExercises = () => {
    return {
        type: actionTypes.RESET_EXERCISES
    }
}

export const retrieveExercises = (userId) => {
    return dispatch => {
        dispatch({ type: actionTypes.TOGGLE_LOAD });
        axios.get(`${BASE_URL}/users/${userId}/exercises.json?auth=${localStorage.getItem('token')}`)
            .then(res => {
                dispatch(setExercises(res.data));
                dispatch({ type: actionTypes.TOGGLE_LOAD });
            })
            .catch(err => {
                dispatch({ type: actionTypes.TOGGLE_LOAD });
            })
    }
}

export const editExercise = (userId, changedValues, key) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch({ type: actionTypes.EDIT_EXERCISE, key, changedValues });
            return 'Exercise succesfully edited!';
        }
        function onError(error) {
            throw new Error('Exercise could not be edited.');
        }

        try {
            const res = await axios.patch(`${BASE_URL}/users/${userId}/exercises/${key}/.json?auth=${localStorage.getItem('token')}`, changedValues);
            return onSuccess(res);
        } catch (error) {
            return onError(error.response);
        }
    }
}

export const postExerciseToDB = (userId, exerciseData) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch(addExercise(exerciseData.name, exerciseData.bodyP, success.data.name));
            dispatch({ type: actionTypes.TOGGLE_LOAD });
            return 'Exercise created successfully!';
        }
        function onError(error) {
            throw new Error('Exercise could not be created.');
        }

        dispatch({ type: actionTypes.TOGGLE_LOAD });
        try {
            const res = await axios.post(`${BASE_URL}/users/${userId}/exercises.json?auth=${localStorage.getItem('token')}`, exerciseData);
            return onSuccess(res);
        } catch (error) {
            return onError(error.response);
        }
    }
}

export const onDeleteExercise = (userId, key) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch(removeExercise(key));
            dispatch({ type: actionTypes.TOGGLE_LOAD });
            return 'Exercise deleted successfully!';
        }

        function onError(error) {
            throw new Error('Failed to delete exercise.');
        }

        dispatch({ type: actionTypes.TOGGLE_LOAD });
        try {
            const success = await axios.delete(`${BASE_URL}/users/${userId}/exercises/${key}.json?auth=${localStorage.getItem('token')}`);
            return onSuccess(success);
        } catch (error) {
            return onError(error.response);
        }

    }
}

export const addEntry = (date, key, userId) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch({ type: actionTypes.ADD_ENTRY, exerciseKey: key, entryKey: success.data.name, date });
            dispatch({ type: actionTypes.TOGGLE_LOAD });
            return 'Entry was added!';
        }
        function onError() {
            throw new Error('Failed to add entry.');
        }

        dispatch({ type: actionTypes.TOGGLE_LOAD });
        try {
            const success = await axios.post(`${BASE_URL}/users/${userId}/exercises/${key}/entries.json?auth=${localStorage.getItem('token')}`, { date });
            return onSuccess(success);
        } catch (error) {
            return onError();
        }

    }
}

export const deleteEntry = (keyA, keyB, userId) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch({ type: actionTypes.DELETE_ENTRY, payload: { keyA, keyB } });
            return 'Entry was deleted!';
        }
        function onError(error) {
            throw new Error('Failed to delete entry.')
        }

        try {
            const res = await axios.delete(`${BASE_URL}/users/${userId}/exercises/${keyA}/entries/${keyB}.json?auth=${localStorage.getItem('token')}`);
            return onSuccess(res);
        } catch (error) {
            return onError(error.response);
        }
    }
}

export const addSet = (data, keyA, keyB, userId) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch({ type: actionTypes.ADD_SET, setKey: success.data.name, setData: data, keyA, keyB });
            return 'Added new set!'
        }

        function onError(error) {
            throw new Error('Failed to add new set.');
        }

        try {
            const res = await axios.post(`${BASE_URL}/users/${userId}/exercises/${keyA}/entries/${keyB}/sets.json?auth=${localStorage.getItem('token')}`, data)
            return onSuccess(res);
        } catch (error) {
            return onError(error.response);
        }
    }
}

export const deleteSet = (keys, userId) => {
    return async dispatch => {
        const { keyA, keyB, keyC } = keys;
        function onSuccess() {
            dispatch({ type: actionTypes.DELETE_SET, keys });
            return 'Set deleted.';
        }
        function onError(error) {
            throw new Error('Set could not be deleted.');
        }

        try {
            await axios.delete(`${BASE_URL}/users/${userId}/exercises/${keyA}/entries/${keyB}/sets/${keyC}.json?auth=${localStorage.getItem('token')}`);
            return onSuccess();
        } catch (error) {
            return onError(error);
        }
    }
}


export const savePrefs = (data, key, userId) => {
    return async dispatch => {
        function onSuccess(success) {
            dispatch({ type: actionTypes.SAVE_PREFS, data: success.data, key });
            return 'Saved set preferences!';
        }

        function onError(error) {
            throw new Error('Failed to save preferences.');
        }

        try {
            const res = await axios.patch(`${BASE_URL}/users/${userId}/exercises/${key}/prefs/.json?auth=${localStorage.getItem('token')}`, data);
            return onSuccess(res);
        } catch (error) {
            return onError(error);
        }
    }
}