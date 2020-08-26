import React, { Component } from 'react';
import { Switch, Link, withRouter, Redirect } from 'react-router-dom';
import RouterCreate from '../routerBase';
import CommonLoading from './commonLoading';

class App extends Component {
    constructor(props) {
        super(props);
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
        this.routerCreate.Mounted = (to) => {
            console.log('Mounted', to);
        };
        this.routerCreate.AfterEnter = (to) => {
            console.log('AfterEnter', to);
        };

        const Loading = () => {
            return <div><CommonLoading /></div>;
        };
        this.routerCreate.loading = Loading;
    }
    render() {
        return (
            <div>
                <Switch>
                    {this.routerCreate.render()}
                    <Redirect to="/404" />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
