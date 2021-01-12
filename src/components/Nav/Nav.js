import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from 'antd'
import { HomeOutlined } from '@ant-design/icons';

class Nav extends Component {
    state = {

    };

    render() {
        return (
            <Menu onClick={this.handleClick} selectedKeys={[this.props.location.pathname]} mode="horizontal">
                <Menu.Item key="/home" disabled={!this.props.isAuth} icon={<HomeOutlined />}>
                    <Link to="/home">Home</Link>
                </Menu.Item>
                {this.props.isAuth ?
                    <Menu.Item key="/logout">
                        <Link to="/logout">Log Out</Link>
                    </Menu.Item> :
                    <Menu.Item key="/login">
                        <Link to="/login">Login</Link>
                    </Menu.Item>}
            </Menu>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null,
        email: state.auth.email
    }
}

export default connect(mapStateToProps)(withRouter(Nav));
