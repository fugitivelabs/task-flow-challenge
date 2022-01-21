// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import other libraries
import { DateTime } from 'luxon';

const FlowListItem = ({
  flow
}) => {
  return (
    <tr>
      <td><Link to={`/flows/${flow._id}`}> {flow.name}</Link></td>
        <td className="numbers">{DateTime.fromISO(flow.updated).toLocaleString(DateTime.DATETIME_SHORT)}</td>
        <td className="numbers">{DateTime.fromISO(flow.created).toLocaleString(DateTime.DATETIME_SHORT)}</td>
      </tr>
    )
  }

FlowListItem.propTypes = {
  flow: PropTypes.object.isRequired
}

export default FlowListItem;
