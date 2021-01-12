import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util';

const initialState = {
    exercises: [],
    current: null,
    loading: false
}

const toggleLoad = (state) => updateObject(state, { loading: !state.loading });

const setExercises = (state, action) => {
    const { data } = action;

    const prefsArr = Object.keys(data).map(key => {
        return { ...data[key].prefs };
    });

    Object.keys(data).forEach((key, index) => data[key].prefs = prefsArr[index]);

    return updateObject(state, {
        exercises: Object.keys(data).map(key => {
            if (data[key].entries) {
                const reversedEntries = Object.keys(data[key].entries).map(el => {
                    if (data[key].entries[el].sets) {
                        const allSets = Object.keys(data[key].entries[el].sets).map(set => {
                            const { weight, reps, rest, notes, date } = data[key].entries[el].sets[set];
                            return { date, weight, reps, rest, notes, key: set };
                        });
                        return {
                            date: data[key].entries[el].date,
                            sets: allSets,
                            key: el
                        };
                    }
                    return { date: data[key].entries[el].date, sets: [], key: el };
                }).reverse();
                return { name: data[key].name, bodyP: data[key].bodyP, entries: reversedEntries, prefs: data[key].prefs, key };
            }
            return { name: data[key].name, bodyP: data[key].bodyP, entries: [], prefs: data[key].prefs, key };
        }).reverse()
    });
}

const addExercise = (state, action) => updateObject(state, { exercises: [{ name: action.payload.e, bodyP: action.payload.b, entries: [], prefs: { weight: 45, reps: 1, rest: 60 }, key: action.payload.key }, ...state.exercises] });

const editExercise = (state, action) => {
    const exerciseIndex = state.exercises.findIndex(el => el.key === action.key);
    const copyArray = [...state.exercises];
    Object.keys(action.changedValues).forEach(key => copyArray[exerciseIndex][key] = action.changedValues[key]);
    return updateObject(state, { exercises: copyArray });
}

const removeExercise = (state, action) => updateObject(state, { exercises: state.exercises.filter(el => el.key !== action.key) });

const setCurrent = (state, action) => updateObject(state, { current: { ...state.exercises[action.index] } });

const addEntry = (state, action) => {
    let copyArray = [...state.current.entries];
    if (copyArray.length > 0) {
        copyArray = [{ date: action.date, key: action.entryKey, sets: [] }, ...state.current.entries];
    } else {
        copyArray = state.current.entries.concat({ date: action.date, key: action.entryKey, sets: [] });
    }
    const index = state.exercises.findIndex(el => el.key === action.exerciseKey);
    let newRoot = [...state.exercises];
    newRoot[index].entries = copyArray;

    return { ...state, exercises: newRoot, current: { ...state.current, entries: copyArray } };
}

const deleteEntry = (state, action) => {
    const exIndex = state.exercises.findIndex(el => el.key === action.payload.keyA);
    let filteredArray = state.current.entries.filter(el => el.key !== action.payload.keyB);
    let newRoot = [...state.exercises];
    newRoot[exIndex].entries = filteredArray;

    return updateObject(state, { exercises: newRoot, current: { ...state.current, entries: filteredArray } });
}

const addSet = (state, action) => {
    const { setKey, setData, keyA, keyB } = action;
    const { date, weight, reps, rest, notes } = setData;
    const exIndex = state.exercises.findIndex(el => el.key === keyA);
    const enIndex = state.exercises[exIndex].entries.findIndex(el => el.key === keyB);
    const formattedSet = { date, weight, reps, rest, notes, key: setKey };

    let newRoot = [...state.exercises];
    newRoot[exIndex].entries[enIndex].sets.push(formattedSet);
    return updateObject(state, { exercise: newRoot, current: { ...state.current, entries: newRoot[exIndex].entries } });
}

const deleteSet = (state, action) => {
    const { keyA, keyB, keyC } = action.keys;
    const exIndex = state.exercises.findIndex(el => el.key === keyA);
    const enIndex = state.current.entries.findIndex(el => el.key === keyB);
    const filteredSets = state.current.entries[enIndex].sets.filter(el => el.key !== keyC);

    let newRoot = [...state.exercises];
    newRoot[exIndex].entries[enIndex].sets = filteredSets;

    return updateObject(state, { exercises: newRoot, current: newRoot[exIndex] });
}

const savePrefs = (state, action) => {
    const exIndex = state.exercises.findIndex(el => el.key === action.key);
    let newRoot = [...state.exercises];
    newRoot[exIndex].prefs = action.data;
    return updateObject(state, { exercises: newRoot, current: newRoot[exIndex] });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_LOAD: return toggleLoad(state, action);
        case actionTypes.SET_EXERCISES: return setExercises(state, action);
        case actionTypes.ADD_EXERCISE: return addExercise(state, action);
        case actionTypes.EDIT_EXERCISE: return editExercise(state, action);
        case actionTypes.REMOVE_EXERCISE: return removeExercise(state, action);
        case actionTypes.RESET_EXERCISES: return { ...initialState };
        case actionTypes.SET_CURRENT: return setCurrent(state, action);
        case actionTypes.ADD_ENTRY: return addEntry(state, action);
        case actionTypes.DELETE_ENTRY: return deleteEntry(state, action);
        case actionTypes.ADD_SET: return addSet(state, action);
        case actionTypes.DELETE_SET: return deleteSet(state, action);
        case actionTypes.SAVE_PREFS: return savePrefs(state, action);
        default:
    }
    return state;
}

export default reducer;