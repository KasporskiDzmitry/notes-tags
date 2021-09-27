import React from 'react';

const Filter = (props) => {
    return <div className='filter'>
        <input type="text" placeholder='поиск по тэгу' onChange={(e) => props.setFilter(e.target.value)}/>
    </div>
};

export default Filter;