import React from 'react';

export default ({tags}) => (
    <div>
        {tags.map(tag => <code style={{marginRight: "10px"}}key={tag}>{tag}</code>)}
    </div>
)