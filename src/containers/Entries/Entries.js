import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { awaitPop } from '../../shared/util/util';
import moment from 'moment';
import classes from './Entries.module.css';
import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../components/Auxiliary/Auxiliary';
import Sets from './Sets/Sets';
import { Tooltip, Button, Collapse, Empty, Popconfirm, message, Form, InputNumber, Input } from 'antd';
import { PlusOutlined, LeftOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

class Entries extends Component {
    state = {
        showModal: false,
        key: null,
        weight: null,
        reps: null,
        rest: null,
        notes: ''
    }

    componentDidMount() {
        this.props.onSetExercise(this.props.index);
    }

    messagePop = (success, error) => {
        const style = {
            marginTop: '42px'
        }
        if (success) return message.success({ content: success, style });
        message.error({ content: error.message, style });
    }

    onAddEntryHandler = async () => {
        const date = new Date();
        const { onAddEntry, exercises, index, uid } = this.props;
        await awaitPop(onAddEntry, this.messagePop, date, exercises[index].key, uid);
    }

    onEntryDeleteHandler = async (key) => {
        const { onDeleteEntry, current, uid } = this.props;
        await awaitPop(onDeleteEntry, this.messagePop, current.key, key, uid);
    }

    onSubmitSet = async () => {
        const { key, weight, reps, rest, notes } = this.state;
        const { onAddSet, current, uid } = this.props;
        const date = new Date();
        const setData = { weight, reps, rest, notes, date };
        this.setState({ showModal: false });
        await awaitPop(onAddSet, this.messagePop, setData, current.key, key, uid);
    }

    onDeleteSetHandler = async (entryKey, setKey) => {
        const { onDeleteSet, current, uid } = this.props;
        const keys = {
            keyA: current.key,
            keyB: entryKey,
            keyC: setKey
        }

        await awaitPop(onDeleteSet, this.messagePop, keys, uid);
    }

    onSavePrefs = async () => {
        const { weight, reps, rest } = this.state;
        const { onSavePrefs, uid, current } = this.props;

        const someNull = weight === null || reps === null || rest === null;
        if (someNull) return;

        const prefs = { weight, reps, rest };
        await awaitPop(onSavePrefs, this.messagePop, prefs, current.key, uid);
    }

    onBackHandler = () => this.props.history.goBack();

    onAddSetHandler = key => {
        const { weight, rest, reps } = this.props.current.prefs;
        this.setState({ showModal: true, key, weight, rest, reps });
    }

    onCloseModalHandler = () => this.setState({ showModal: false, notes: '' });

    onFormChangeHandler = (changedValues) => this.setState(changedValues);

    calcVolume = (setsArray) => setsArray.map(set => set.weight * set.reps).reduce((a, b) => a + b, 0);

    render() {
        const { current, loading } = this.props;
        const { showModal, weight, reps, rest } = this.state;
        const { Panel } = Collapse;
        const addDisabled = weight === null || reps === null || rest === null;
        let changedPrefs = false;
        let defaultVals = { weight, reps, rest };

        let entries = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Entries" style={{ margin: '120px auto' }} />;
        if (current) {
            changedPrefs = Object.keys(current.prefs).some(key => this.state[key] !== current.prefs[key]);
            defaultVals = { ...current.prefs };
            if (current.entries.length > 0) {
                entries = (
                    <Aux>
                        <div className={[classes.Accent_Bar, classes.Blue].join(' ')}></div>
                        <Collapse expandIconPosition='right' style={{ fontSize: '16px' }} accordion>
                            {current.entries.map(key => (
                                <Panel header={moment(key.date).format("MMM Do YYYY, hh:mm a")} key={key.key}>
                                    <div style={{ height: '50px', position: 'relative', width: '100%' }}>
                                        <p style={{ fontSize: '17px' }}><strong>Volume:</strong> {key.sets.length > 0 ? this.calcVolume(key.sets) : '(no sets)'}</p>
                                        <Popconfirm placement="left" title="Delete this entry?" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} okText="Yes" cancelText="No" onConfirm={() => this.onEntryDeleteHandler(key.key)}>
                                            <Button icon={<DeleteOutlined />} size="regular" style={{ position: 'absolute', right: '0', top: '0' }} />
                                        </Popconfirm>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        {key.sets ? <Sets data={key.sets} clicked={this.onDeleteSetHandler} entryKey={key.key} /> : null}
                                        <Button type="dashed" style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }} onClick={() => this.onAddSetHandler(key.key)}><strong>Add Set +</strong></Button>
                                    </div>
                                </Panel>
                            ))}
                        </Collapse>
                        <div className={[classes.Accent_Bar, classes.Gray].join(' ')}></div>
                    </Aux>
                )
            }
        }

        let setForm = (
            <div>
                <h1>Add Set</h1>
                <Form onValuesChange={this.onFormChangeHandler}>
                    <div style={{ display: 'flex', width: '80%', margin: '10px auto 0', justifyContent: 'space-between' }}>
                        <Form.Item label="Weight" name="weight" initialValue={defaultVals.weight} required>
                            <InputNumber precision="1" step={2.5} style={{ fontSize: '16px' }} />
                        </Form.Item>
                        <Form.Item label="Reps" name="reps" initialValue={defaultVals.reps} required>
                            <InputNumber style={{ fontSize: '16px' }} />
                        </Form.Item>
                    </div>
                    <div className={classes.R_Input}>
                        <Form.Item label="Rest (secs)" name="rest" initialValue={defaultVals.rest} required>
                            <InputNumber step={10} style={{ fontSize: '16px' }} />
                        </Form.Item>
                    </div>
                    <Form.Item label="Notes" name="notes" initialValue="">
                        <Input style={{ fontSize: '16px' }} />
                    </Form.Item>
                </Form>
                <div style={{ display: 'flex', width: 'max-content', margin: '0 auto' }}>
                    <Button type="primary" shape="round" style={{ width: '100px' }} danger onClick={this.onCloseModalHandler}>Cancel</Button>
                    <Button type="primary" shape="round" style={{ width: '100px' }} htmlType="submit" disabled={addDisabled} onClick={this.onSubmitSet}>
                        Submit
                        </Button>
                </div>
                <p className={classes.Save_Settings} onClick={this.onSavePrefs} style={changedPrefs ? null : { opacity: '0', pointerEvents: 'none' }}>Save Settings</p>

            </div>
        )

        return (
            <div className={classes.Container}>
                <h1 >{current ? current.name : null}</h1>
                {entries}
                <div className={classes.Add_Button}>
                    <Tooltip title="Add">
                        <Button
                            disabled={loading}
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={this.onAddEntryHandler} />
                    </Tooltip>
                </div>
                <div className={classes.Back_Button}>
                    <Tooltip title="Home">
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<LeftOutlined />}
                            onClick={this.onBackHandler} />
                    </Tooltip>
                </div>
                <Modal show={showModal} clicked={this.onCloseModalHandler}>
                    {showModal ? setForm : null}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        exercises: state.home.exercises,
        uid: state.auth.userId,
        current: state.home.current,
        loading: state.home.loading,
        index: state.home.exercises.findIndex(el => el.name === ownProps.match.params.name)

    }
}

// day streaks
// diet ????

const mapDispatchToProps = (dispatch) => {
    return {
        onSetExercise: (index) => dispatch({ type: actionTypes.SET_CURRENT, index }),
        onAddEntry: (date, key, UID) => dispatch(actions.addEntry(date, key, UID)),
        onDeleteEntry: (keyA, keyB, UID) => dispatch(actions.deleteEntry(keyA, keyB, UID)),
        onAddSet: (data, keyA, keyB, UID) => dispatch(actions.addSet(data, keyA, keyB, UID)),
        onDeleteSet: (keys, UID) => dispatch(actions.deleteSet(keys, UID)),
        onSavePrefs: (data, key, UID) => dispatch(actions.savePrefs(data, key, UID))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Entries));