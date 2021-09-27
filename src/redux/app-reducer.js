import axios from "axios";

const SET_NOTES = 'SET_NOTES';
const ADD_NOTE = 'ADD_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';
const SET_EDITING_NOTE = 'SET_EDITING_NOTE';
const SET_EDIT_MODE = 'SET_EDIT_MODE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const SET_FILTER = 'SET_FILTER';
const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';


const initialState = {
    notes: [],

    currentNote: {
        html:'',
        tags: [],
        created: ''
    },
    editingNote: null,
    isEditMode: false,
    filter: undefined
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTES: {
            return {
                ...state,
                notes: action.notes.reverse()
            }
        }
        case SET_CURRENT_NOTE: {
            return {
                ...state,
                currentNote: action.note
            }
        }
        case SET_EDIT_MODE: {
            return {
                ...state,
                isEditMode: action.isEditMode
            }
        }
        case ADD_NOTE: {
            return {
                ...state,
                notes: [...state.notes, action.note].reverse(),
                currentNote: {
                    html:'',
                    tags: [],
                    created: ''
                }
            }
        }
        case UPDATE_NOTE: {
            return {
                ...state,
                notes: state.notes.map(i => {
                    if (i.id === action.note.id) {
                        i = action.note
                    }
                    return i;
                }),
                currentNote: {
                    html:'',
                    tags: [],
                    created: ''
                }
            }
        }
        case DELETE_NOTE: {
            return {
                ...state,
                notes: state.notes.filter(i => i.id !== action.id),
                currentNote: {
                    html:'',
                    tags: [],
                    created: ''
                }
            }
        }
        case SET_EDITING_NOTE: {
            return {
                ...state,
                editingNote: action.note
            }
        }
        case SET_FILTER: {
            return {
                ...state,
                filter: action.filter
            }
        }
        default: {
            return state
        }
    }
};

const setNotes = notes => ({type: SET_NOTES, notes});

export const addNote = note => ({type: ADD_NOTE, note});
export const deleteNote = id => ({type: DELETE_NOTE, id});
export const setEditMode = isEditMode => ({type: SET_EDIT_MODE, isEditMode});
export const updateLocally = note => ({type: UPDATE_NOTE, note});
export const setFilter = filter => ({type: SET_FILTER, filter});
export const setCurrentNote = note => ({type: SET_CURRENT_NOTE, note});

export const saveNote = note => async dispatch => {
    note.created = new Date().toLocaleString();
    const response = await axios.post('http://localhost:8000/notes', note);
    dispatch(addNote(response.data));
};

export const loadNoteById = id => async dispatch => {
    const response = await axios.get(`http://localhost:8000/notes/${id}`);
    dispatch(setCurrentNote(response.data));
    dispatch(setEditMode(true));
};

export const updateNote = note => async dispatch => {
    note.created = new Date().toLocaleString();
    const response = await axios.put(`http://localhost:8000/notes/${note.id}`, note);
    dispatch(updateLocally(note));
    dispatch(setEditMode(false));
}

export const deleteNoteById = id => async dispatch => {
    await axios.delete(`http://localhost:8000/notes/${id}`);
    dispatch(deleteNote(id));
    dispatch(setEditMode(false));
};

export const loadNotes = () => async dispatch => {
    const response = await axios.get('http://localhost:8000/notes');
    dispatch(setNotes(response.data))
};

export default appReducer;