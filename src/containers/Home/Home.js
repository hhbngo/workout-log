import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { awaitPop } from '../../shared/util/util';
import * as actions from '../../store/actions/index';
import classes from './Home.module.css';
import ModalSecond from '../../components/UI/Modal/Modal';
import { Button, Tooltip, Form, Input, Select, Card, Modal, Empty, Spin, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, BarsOutlined } from '@ant-design/icons';

const MUSCLES_LIST = ['Chest', 'Back', 'Arms', 'Abdominals', 'Legs', 'Shoulders', 'Compound'];

class Home extends Component {
    state = {
        showModal: false,
        showDeleteConfirmModal: false,
        formMode: null,
        selectedExercise: { name: null, bodyP: null },
        exrName: '',
        bodyName: null,
        duplicateError: false,
        noChangeError: false
    }

    componentDidMount() {
        if (this.props.exercises.length === 0) this.props.onRetrieveExercises(this.props.uid);
    }

    messagePop = (success, error) => {
        const style = {
            marginTop: '42px'
        }
        if (success) message.success({ content: success, style });
        else if (error) message.error({ content: error.message, style });
    }

    onAddHandler = () => this.setState({ showModal: true, formMode: 'adding' });

    onNewExerciseSubmit = async () => {
        const { exrName, bodyName } = this.state;
        const { onAddExercise, exercises, uid } = this.props;
        const exrData = { name: exrName, bodyP: bodyName, prefs: { weight: 45, reps: 1, rest: 60 } };

        if (exercises.some(el => el.name.toLowerCase() === exrName.toLowerCase())) return this.setState({ duplicateError: true });
        this.setState({ showModal: false, duplicateError: false });
        await awaitPop(onAddExercise, this.messagePop, uid, exrData);
    }

    onEditSubmit = async () => {
        const { exrName, bodyName, selectedExercise } = this.state;
        const { onEditExercise, exercises, uid } = this.props;
        const nameExists = exercises.filter(el => el.name.toLowerCase() !== exrName.toLowerCase()).some(el => el.name.toLowerCase() === exrName.toLowerCase());
        const noChanges = (exrName === selectedExercise.name && bodyName === selectedExercise.bodyP);

        if (noChanges) return this.setState({ noChangeError: true });
        else if (nameExists) return this.setState({ duplicateError: true });

        const changedData = {};
        if (exrName !== selectedExercise.name) changedData.name = exrName;
        if (bodyName !== selectedExercise.bodyP) changedData.bodyP = bodyName;

        this.setState({ showModal: false, duplicateError: false, noChangeError: false });
        await awaitPop(onEditExercise, this.messagePop, uid, changedData, selectedExercise.key);
    }

    onDeleteConfirm = async () => {
        const { selectedExercise } = this.state;
        const { onDeleteExercise, uid } = this.props;
        this.setState({ showDeleteConfirmModal: false });
        await awaitPop(onDeleteExercise, this.messagePop, uid, selectedExercise.key);
    }

    onCloseHandler = () => this.setState({ showModal: false, formMode: null, duplicateError: false, noChangeError: false, exrName: '', bodyName: null });

    onDeleteModalClose = () => this.setState({ showDeleteConfirmModal: false });

    onModalChangeHandler = (changedValues) => {
        const changedVar = Object.keys(changedValues)[0];
        this.setState({ [changedVar]: changedValues[changedVar], duplicateError: false, noChangeError: false });
    }

    onCardActionClick = (name, exerciseName, key) => {
        const selectedExercise = this.props.exercises.find(el => el.key === key);

        switch (name) {
            case 'view':
                this.props.history.push(`/entries/${encodeURI(exerciseName)}`);
                break;
            case 'edit':
                this.setState({ showModal: true, formMode: 'editing', selectedExercise, exrName: selectedExercise.name, bodyName: selectedExercise.bodyP })
                break;
            case 'delete':
                this.setState({ showDeleteConfirmModal: true, selectedExercise });
                break;
            default: return
        }
    }

    render() {
        const { duplicateError, noChangeError, showModal, showDeleteConfirmModal, exrName, bodyName, formMode, selectedExercise } = this.state;
        const { exercises, loading } = this.props;
        const addingMode = formMode === 'adding';
        const addDisabled = exrName.replace(/\s+/g, '').length === 0 || bodyName === null;
        let formError = null;

        if (duplicateError || noChangeError) {
            formError = {
                message: duplicateError ? 'Exercise name already exists!' : 'No changes detected.',
                status: duplicateError ? 'error' : 'warning'
            }
        };

        let exercisesCards = <Spin size="large" style={{ width: '100%', margin: '200px auto' }} />

        if (!loading) {
            if (exercises.length < 1) exercisesCards = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Exercises" style={{ margin: '200px auto' }} />
            else if (exercises.length > 0) {
                exercisesCards = exercises.map(ex => {
                    return (
                        <Card
                            key={ex.key}
                            size='small'
                            title={ex.name.toUpperCase()}
                            bordered={false}
                            className={classes.Card} style={{ marginBottom: '20px', fontSize: '16px' }}
                            headStyle={{ borderTop: '5px solid #1890ff' }}
                            actions={[
                                <Tooltip placement="bottom" title="View entries" color={'blue'} mouseEnterDelay={0} mouseLeaveDelay={0}>
                                    <BarsOutlined key="view" onClick={() => this.onCardActionClick('view', ex.name, ex.key)} />
                                </Tooltip>,
                                <EditOutlined key="edit" onClick={() => this.onCardActionClick('edit', ex.name, ex.key)} />,
                                <DeleteOutlined key="delete" onClick={() => this.onCardActionClick('delete', ex.name, ex.key)} />
                            ]}
                        >
                            <p>{ex.bodyP}</p>
                            <p>{`[ ${Object.keys(ex.entries).length} entries ]`}</p>
                            <p style={{ color: '#A8A8A8' }}>Last updated: {ex.entries.length > 0 ? moment(ex.entries[0].date).format('MM/DD/YY, hh:mm A') : 'N/A'}</p>
                        </Card>
                    )
                });
            }
        }

        let modalForm = (
            <div>
                <h1>{addingMode ? 'Add Exercise' : 'Edit Exercise'}</h1>
                <Form onValuesChange={this.onModalChangeHandler} onFinish={addingMode ? this.onNewExerciseSubmit : this.onEditSubmit}>
                    <Form.Item label="Exercise name: " name="exrName" initialValue={!addingMode ? selectedExercise.name : ''} validateStatus={formError ? formError.status : null} help={formError ? formError.message : null} required >
                        <Input style={{ fontSize: '16px' }} />
                    </Form.Item>
                    <Form.Item label="Body part:" name="bodyName" initialValue={!addingMode ? selectedExercise.bodyP : ''} validateStatus={noChangeError ? formError.status : null} help={noChangeError ? formError.message : null} required >
                        <Select style={{ fontSize: '16px' }}>
                            {MUSCLES_LIST.map(el => <Select.Option key={el} value={el}>{el}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <div style={{ display: 'flex', width: 'max-content', margin: '40px auto 0' }}>
                        <Button type="primary" shape="round" style={{ width: '100px' }} danger onClick={this.onCloseHandler}>Cancel</Button>
                        <Button type="primary" shape="round" style={{ width: '100px' }} htmlType="submit" disabled={addDisabled}>
                            {addingMode ? 'Add' : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </div>
        )

        return (
            <div className={classes.Home}>
                <Modal
                    title="CONFIRM DELETE"
                    visible={showDeleteConfirmModal}
                    onOk={this.onDeleteConfirm}
                    onCancel={this.onDeleteModalClose}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                >
                    <h4>Are you sure you want to delete this exercise?</h4>
                </Modal>
                <ModalSecond
                    show={showModal}
                    clicked={this.onCloseHandler}
                >
                    {showModal ? modalForm : null}
                </ModalSecond>
                <div className={classes.Add_Button}>
                    <Tooltip title="Add">
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={this.onAddHandler} />
                    </Tooltip>
                </div>
                <div className={classes.Flex}>
                    {exercisesCards}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        exercises: state.home.exercises,
        loading: state.home.loading,
        uid: state.auth.userId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddExercise: (UID, exerciseData) => dispatch(actions.postExerciseToDB(UID, exerciseData)),
        onRetrieveExercises: (UID) => dispatch(actions.retrieveExercises(UID)),
        onDeleteExercise: (UID, key) => dispatch(actions.onDeleteExercise(UID, key)),
        onEditExercise: (UID, changed, key) => dispatch(actions.editExercise(UID, changed, key))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));