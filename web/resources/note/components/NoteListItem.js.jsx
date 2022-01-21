// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import other libraries
import { DateTime } from 'luxon';

const NoteListItem = ({
  note
}) => {
  return (
    <tr>
      <td>
        <p>{note.content}</p>
      </td>
      <td className="numbers">{DateTime.fromISO(note.updated).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td className="numbers">{DateTime.fromISO(note.created).toLocaleString(DateTime.DATETIME_SHORT)}</td>
    </tr>
  )
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired
}

export default NoteListItem;
