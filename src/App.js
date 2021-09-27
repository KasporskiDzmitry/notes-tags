import './App.scss';
import InputArea from "./components/InputArea";
import Filter from "./components/Filter";
import React, {Component} from "react";
import {connect} from "react-redux";
import {
    deleteNoteById,
    loadNoteById,
    loadNotes,
    saveNote, setCurrentNote,
    setEditMode, setFilter, updateNote,
} from "./redux/app-reducer";
import NoteList from "./components/NoteList";


class App extends Component {

    componentDidMount() {
        this.props.loadNotes();
    }

    render() {
        return (
            <div className="app">
                <InputArea saveNote={this.props.saveNote} editingNote={this.props.editingNote}
                           isEditMode={this.props.isEditMode} updateNote={this.props.updateNote}
                           deleteNoteById={this.props.deleteNoteById} setEditMode={this.props.setEditMode}
                           currentNote={this.props.currentNote} setCurrentNote={this.props.setCurrentNote}/>
                <aside className='aside'>
                    <Filter setFilter={this.props.setFilter}/>
                    <NoteList notes={this.props.notes} filter={this.props.filter} loadNoteById={this.props.loadNoteById}
                              setCurrentNote={this.props.setCurrentNote} isEditMode={this.props.isEditMode}/>
                </aside>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    notes: state.appReducer.notes,
    editingNote: state.appReducer.editingNote,
    isEditMode: state.appReducer.isEditMode,
    filter: state.appReducer.filter,
    currentNote: state.appReducer.currentNote
});

export default connect(mapStateToProps, {
    loadNotes,
    saveNote,
    deleteNoteById,
    loadNoteById,
    setEditMode,
    updateNote,
    setFilter,
    setCurrentNote
})(App)
