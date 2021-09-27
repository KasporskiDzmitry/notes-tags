import React, {useEffect, useState} from 'react';

const Note = (props) => {
    const [isEditMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!props.isEditMode) {
            setEditMode(false);
        }
    }, [props.isEditMode])

    const handleClick = (e) => {
        setEditMode(!isEditMode);
        props.loadNoteById(props.id);
    };


    return <div className='note' onClick={handleClick}>
        <div className='note-info'>
            <div className='note-date'>{props.created}</div>
            <div className='note-text' dangerouslySetInnerHTML={{__html: props.html}}></div>
        </div>
        <div className='tags'>
            {
                props.tags.map(i => <span className='tag'>{i}</span>)
            }
        </div>
    </div>
};

export default Note;