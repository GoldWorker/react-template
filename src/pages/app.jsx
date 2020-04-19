import React, { Component } from 'react';
import { Switch, Link, withRouter } from 'react-router-dom';
import RouterCreate from '../routerBase';
import { Menu, Icon } from 'antd';
import 'antd/es/menu/style/css';
import CommonLoading from './commonLoading';

const Loading = () => {
    return <div><CommonLoading /></div>;
};

const { SubMenu } = Menu;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyPath: [this.props.location.pathname]
        };
        console.log(this.props);
        this.routerCreate = new RouterCreate();
        this.routerCreate.config = [{
            path: '/demo',
            component: () => import('./demo/highorder-demo')
        }, {
            path: '/manager',
            component: () => import('./manager')
        }, {
            path: '/',
            component: () => import('./connector')
        }];
        this.routerCreate.BeforeEnter = (to) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('BeforeEnter', to);
                    resolve();
                }, 1000);
            });
        };
        this.routerCreate.BeforeWillEnter = () => {
            console.log('BeforeWillEnter');
        };
        this.routerCreate.AfterEnter = (to) => {
            console.log('AfterEnter', to);
        };
        this.routerCreate.loading = Loading;
    }
    handleSelectMenu = (res) => {
        const { item, key, keyPath, selectedKeys } = res;
    }
    render() {
        return (
            <div className="d-f fullscreen">
                <div className="s0" style={{ height: '100%' }}>
                    <div className="d-f fd-c" style={{ height: '100%' }}>
                        <div className="s0 fs20 ta-c ptb16 bor-r b-side">CLI</div>
                        <Menu
                            onClick={this.handleClick}
                            style={{ width: 256, height: '100%' }}
                            defaultSelectedKeys={this.state.keyPath}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            onSelect={this.handleSelectMenu}
                        >
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
                                        <Icon type="mail" />
                                        <span>Test</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="/"><Link to="/">/</Link></Menu.Item>
                                <Menu.Item key="/manager"><Link to="/manager">/manager</Link></Menu.Item>
                            </SubMenu>
                            <Menu.Item key="/demo">
                                <Link to="/demo"><Icon type="appstore" />demo</Link>
                            </Menu.Item>
                            <SubMenu
                                key="sub4"
                                title={
                                    <span>
                                        <Icon type="setting" />
                                        <span>Navigation Three</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="9">Option 9</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                </div>
                <div className="flex1 p16 bg-title ov-a">
                    <div className="bg-w">
                        <Switch>
                            {this.routerCreate.render()}
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
