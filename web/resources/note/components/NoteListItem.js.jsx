// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NoteListItem = ({
  note
}) => {
  return (
    <li>
      <p>{note.content}</p>
    </li>
  )
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired
}

export default NoteListItem;
