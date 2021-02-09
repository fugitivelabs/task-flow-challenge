/**
 * View component for /flows/:flowId
 *
 * Displays a single flow from the 'byId' map in the flow reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as flowActions from '../flowActions';
import * as noteActions from '../../note/noteActions';
import * as taskActions from '../../task/taskActions';

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import FlowLayout from '../components/FlowLayout.js.jsx';
import NoteForm from '../../note/components/NoteForm.js.jsx';
import NoteListItem from '../../note/components/NoteListItem.js.jsx';
import TaskForm from '../../task/components/TaskForm.js.jsx';
import TaskListItem from '../../task/components/TaskListItem.js.jsx';

class SingleFlow extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      note: _.cloneDeep(this.props.defaultNote.obj)
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      , noteFormHelpers: {}
      , showNoteForm: false 
      , showTaskForm: false 
      , task: _.cloneDeep(this.props.defaultTask.obj)
      // NOTE: We don't want to actually change the store's defaultItem, just use a copy
      , taskFormHelpers: {}
    }
    this._bind(
      '_handleFormChange'
      , '_handleNoteSubmit'
      , '_handleTaskSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(flowActions.fetchSingleIfNeeded(match.params.flowId));
    dispatch(taskActions.fetchDefaultTask());
    dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded('_flow', match.params.flowId));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchListIfNeeded('_flow', match.params.flowId));
    this.setState({
      task: _.cloneDeep(nextProps.defaultTask.obj)
    })
    dispatch(noteActions.fetchListIfNeeded('_flow', match.params.flowId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj)
    })
  }

  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }

  _handleNoteSubmit(e) {
    e.preventDefault();
    const { defaultNote, dispatch, loggedInUser, match } = this.props;
    let newNote = {...this.state.note}
    newNote._flow = match.params.flowId;
    newNote._user = loggedInUser._id;
    dispatch(noteActions.sendCreateNote(newNote)).then(noteRes => {
      if(noteRes.success) {
        dispatch(noteActions.invalidateList('_flow', match.params.flowId));
        this.setState({
          showNoteForm: false
          , note: _.cloneDeep(defaultNote.obj)
        })
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  _handleTaskSubmit(e) {
    e.preventDefault();
    const { defaultTask, dispatch, match } = this.props;
    let newTask = {...this.state.task}
    newTask._flow = match.params.flowId;
    dispatch(taskActions.sendCreateTask(newTask)).then(taskRes => {
      if(taskRes.success) {
        dispatch(taskActions.invalidateList('_flow', match.params.flowId));
        this.setState({
          showTaskForm: false
          , task: _.cloneDeep(defaultTask.obj)
        })
      } else {
        alert("ERROR - Check logs");
      }
    });
  }

  render() {
    const { 
      note
      , noteFormHelpers 
      , showNoteForm
      , showTaskForm
      , task
      , taskFormHelpers 
    } = this.state;
    const { 
      defaultTask      
      , defaultNote
      , flowStore
      , match
      , noteStore
      , taskStore 
    } = this.props;

    /**
     * use the selected.getItem() utility to pull the actual flow object from the map
     */
    const selectedFlow = flowStore.selected.getItem();


    // get the taskList meta info here so we can reference 'isFetching'
    const taskList = taskStore.lists && taskStore.lists._flow ? taskStore.lists._flow[match.params.flowId] : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual task objetcs
     */
    const taskListItems = taskStore.util.getList("_flow", match.params.flowId);
    
    const isFlowEmpty = (
      !selectedFlow
      || !selectedFlow._id
      || flowStore.selected.didInvalidate
    );

    const isFlowFetching = (
      flowStore.selected.isFetching
    )

    const isTaskListEmpty = (
      !taskListItems
      || !taskList
    );

    const isTaskListFetching = (
      !taskListItems
      || !taskList
      || taskList.isFetching
    )

    const isNewTaskEmpty = !task;

    // get the noteList meta info here so we can reference 'isFetching'
    const noteList = noteStore.lists && noteStore.lists._flow ? noteStore.lists._flow[match.params.flowId] : null;

    /**
     * use the reducer getList utility to convert the all.items array of ids
     * to the actual note objetcs
     */
    const noteListItems = noteStore.util.getList("_flow", match.params.flowId);
  
    const isNoteListEmpty = (
      !noteListItems
      || !noteList
    );

    const isNoteListFetching = (
      !noteListItems
      || !noteList
      || noteList.isFetching
    )

    const isNewNoteEmpty = !note;

    return (
      <FlowLayout>
        <br/>
        <small> Single Flow </small>
        { isFlowEmpty ?
          (isFlowFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          :
          <div style={{ opacity: isFlowFetching ? 0.5 : 1 }}>
            <h1> { selectedFlow.name }
            </h1>
            <p> { selectedFlow.description }</p>
            <Link className="yt-btn x-small bordered" to={`${this.props.match.url}/update`}> Edit Flow</Link>
            <hr/>
            { isTaskListEmpty ?
              (isTaskListFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <div style={{ opacity: isTaskListFetching ? 0.5 : 1 }}>
                <h4>Task items</h4>
                <ul>
                  {taskListItems.map((task, i) =>
                    <TaskListItem
                      key={task._id + i}
                      task={task}
                    />
                  )}
                </ul>
              </div>
            }
            { !isNewTaskEmpty && showTaskForm ?
              <div>
                <TaskForm
                  task={task}
                  cancelAction={() => this.setState({showTaskForm: false, task: _.cloneDeep(defaultTask.obj)})}
                  formHelpers={taskFormHelpers}
                  formTitle="Create Task"
                  formType="create"
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleTaskSubmit}
                />
              </div>
              : 
              <button className="yt-btn" onClick={() => this.setState({showTaskForm: true})}>Add new task</button>
            }
            <hr/>
            { isNoteListEmpty ?
              (isNoteListFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
              :
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1 }}>
                <h4>Flow notes</h4>
                <ul>
                  {noteListItems.map((note, i) =>
                    <NoteListItem
                      key={note._id + i}
                      note={note}
                    />
                  )}
                </ul>
              </div>
            }
            { !isNewNoteEmpty && showNoteForm ?
              <div>
                <NoteForm
                  note={note}
                  cancelAction={() => this.setState({showNoteForm: false, note: _.cloneDeep(defaultNote.obj)})}
                  formHelpers={noteFormHelpers}
                  formTitle="Create Note"
                  formType="create"
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleNoteSubmit}
                />
              </div>
              : 
              <button className="yt-btn" onClick={() => this.setState({showNoteForm: true})}>Add flow note </button>
            }
          </div>
        }
      </FlowLayout>
    )
  }
}

SingleFlow.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultNote: store.note.defaultItem
    , defaultTask: store.task.defaultItem
    , flowStore: store.flow
    , loggedInUser: store.user.loggedIn.user 
    , noteStore: store.note 
    , taskStore: store.task
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleFlow)
);
