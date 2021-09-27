import React from 'react';
import Note from "./Note";

const NoteList = ({notes, loadNoteById, filter, setCurrentNote}) => {
    let notesList = [];

    if (filter) {
        notes.forEach(i => {
            i.tags.forEach(t => {
                if (t.toLowerCase().includes(filter)) {
                    notesList.push(i)
                }
            })
        })
    } else {
        notesList = notes;
    }

    return <div className='notes-wrapper'>
        {
            notesList.map(function (elem, index) {
                return <Note key={index} {...elem} loadNoteById={loadNoteById}
                      setCurrentNote={setCurrentNote} />})
        }
    </div>
};

export default NoteList;