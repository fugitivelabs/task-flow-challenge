// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import other libraries
import { DateTime } from 'luxon';

const TaskListItem = ({
  task
}) => {
  return (
    <tr>
      <td><Link to={`/tasks/${task._id}`}> {task.name}</Link></td>
      <td className="numbers">{DateTime.fromISO(task.updated).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      <td className="numbers">{DateTime.fromISO(task.created).toLocaleString(DateTime.DATETIME_SHORT)}</td>
    </tr>
  )
}

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired
}

export default TaskListItem;