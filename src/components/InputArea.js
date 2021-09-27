import React, {Component} from "react";
import ContentEditable from "react-contenteditable";

class InputArea extends Component {
    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();
    }

    handleChange = evt => {
        const tagRegExp = /\B(\#[\wа-я]*\b)/g;
        const tagRegExpWithSpan = /<span>\B(\#[\wа-я]*\b)<\/span>/g;
        const tagFromNewLineRegExp = /\B(<br>\#[\wа-я]*\b)/g;
        const newLineRegExp = /<div><span><br><\/span><\/div>/g;
        const separatorRegExp = /[\s]+/g;
        let html = [];

        const str = evt.target.value.split(separatorRegExp);

        for (let i = 0; i < str.length; i++) {
            if (str[i].match(tagRegExp) && !str[i].includes('<span>')) { // wrapping hashtag by <span>
                str[i] = str[i].replace(tagRegExp, `<span>${str[i].match(tagRegExp)}</span>`);
            }

            if (str[i].includes('<div>') && !str[i].includes('</div>')) { // replace auto-generated <div>
                str[i] = str[i].replace('<div>', '<br>');
                str[i + 1] = str[i + 1].substring(0, str[i + 1].length - 6);
            }

            if (str[i].match(tagFromNewLineRegExp)) { // delete <br> at the end of line
                str[i + 1] = str[i].match(tagFromNewLineRegExp)[0];
                str[i] = str[i].substring(0, str[i].length - 6);
            }

            str[i] = str[i].replace(newLineRegExp, '<br><br>'); // replace auto generated part after <br> tag

            if (tagRegExp.test(str[i]) && str[i].charAt(0) !== '<') { // divide into two items if # printed not after space
                str.splice(i + 1, 0, str[i].substring(str[i].indexOf('<span>')));
                str[i] = str[i].substring(0, str[i].indexOf('<span>'));
            }
            if (str[i].includes('<span>') && !str[i].match(tagRegExpWithSpan)) { // end hashtag if current symbol is not letter or digit
                let nonValidSymbolPos;
                for (let j = 7; j < str[i].length - 7; j++) {
                    const curr = str[i].charAt(j);
                    if (/[^\wа-я]+/g.test(curr)) {
                        nonValidSymbolPos = j;
                        break;
                    }
                }
                str[i + 1] = str[i].slice(nonValidSymbolPos, str[i].length - 7);
                str[i] = str[i].substring(0, nonValidSymbolPos) + '</span>';
                html.push(str[i]);
                html.push(str[i + 1]);
                ++i;
            }
            else {
                html.push(str[i]);
            }
        }

        const tags = str.filter(i => i.match(tagRegExp))
            .map(i => i.substring(i.indexOf('<span>') + 6, i.indexOf('</span>')))
            .filter(i => i.length > 1);

        this.props.setCurrentNote({
            ...this.props.currentNote,
            tags: tags,
            html: html.join(' ')
        })
    };

    saveNote = (e) => {
        this.props.isEditMode ? this.props.updateNote(this.props.currentNote) : this.props.saveNote(this.props.currentNote);
    };

    deleteNote = (e) => {
        if (window.confirm('Удалить?')) {
            this.props.deleteNoteById(this.props.currentNote.id);
        }
        this.props.setEditMode(false);
    };

    render() {
        return <div className='input-area'>
            <ContentEditable
                className='input'
                innerRef={this.contentEditable}
                html={this.props.currentNote?.html || ''} // innerHTML of the editable div
                disabled={false}       // use true to disable editing
                onChange={this.handleChange} // handle innerHTML change
            />
            <div className='control'>
                <button onClick={this.saveNote}>Сохранить</button>
                <button onClick={this.deleteNote} disabled={!this.props.isEditMode}>Удалить</button>
            </div>
        </div>
    }
}

export default InputArea;