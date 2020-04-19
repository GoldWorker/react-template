import React, { Component, FC } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { History } from 'history';

interface RouterBase {
    config: Array<RouterConfig>,
    handleConfig: (conf: RouterConfig[]) => RouterConfig[],
    render: () => JSX.Element[],
    createRouterComponent: (chunkFn: () => Promise<any>) => any,
    loading: Component | FC | JSX.Element | HTMLElement | null,
    BeforeEnter?: (to: RouteComponentProps, from: any) => void | Promise<any>,
    BeforeWillEnter?: (to: RouteComponentProps, from: any) => void | Promise<any>,
    AfterEnter?: (to: RouteComponentProps, from: any) => void
}

interface RouterConfig {
    path: string,
    component: () => Promise<any>
}

interface RouterHandleConfig {
    path: string,
    component: any
}

interface IState {
    loading: boolean,
    Component: Component<any, any> | FC<any> | any
}


/**
 * 代码自动按路由分割、资源按需加载
 *
 * @export
 * @class RouterCreate
 * @implements {RouterBase}
 */
export default class RouterCreate implements RouterBase {

    /**
     * 路由配置，使用import(*)动态导入语法
     * 
     * @type {RouterConfig[]}
     * @memberof RouterCreate
     */
    public config: RouterConfig[] = []

    public loading = null

    /**
     * 生命周期，加载路由前调用，支持返回Promise
     *
     * @memberof RouterCreate
     */
    public BeforeEnter?: (to: RouteComponentProps) => void | Promise<any>


    /**
     * 生命周期，加载完成后，进入渲染路由前调用
     *
     * @memberof RouterCreate
     */
    public BeforeWillEnter?: (to: RouteComponentProps) => void | Promise<any>

    /**
     * 生命周期，进入路由后回调
     *
     * @memberof RouterCreate
     */
    public AfterEnter?: (to: RouteComponentProps) => void

    /**
     * 创建异步加载组件以及路由生命周期
     *
     * @param {() => Promise<any>} chunkFn
     * @returns {*}
     * @memberof RouterCreate
     */
    createRouterComponent(chunkFn: () => Promise<any>): any {
        const BeforeEnter = this.BeforeEnter;
        const BeforeWillEnter = this.BeforeWillEnter;
        const AfterEnter = this.AfterEnter;
        const Loading = this.loading;
        return class AsyncImportComponent extends Component<RouteComponentProps, IState> {
            constructor(props: RouteComponentProps) {
                super(props);
                this.state = {
                    loading: true,
                    Component: Loading
                };
            }

            componentDidMount() {
                this.setState({
                    loading: true
                });
                (async () => {
                    BeforeEnter && await BeforeEnter(this.props);
                    const chunk = await chunkFn();
                    BeforeWillEnter && await BeforeWillEnter(this.props);
                    this.setState({
                        Component: chunk.default,
                        loading: false
                    });
                    // await new Promise((resolve) => {
                    //     setTimeout(() => {
                    //         chunkFn().then((chunk: any) => {
                    //             this.setState({
                    //                 Component: chunk.default,
                    //                 loading: false
                    //             });
                    //         });
                    //         resolve();
                    //     }, 1000);
                    // });
                })();
            }

            componentDidUpdate() {
                const { loading } = this.state;
                if (!loading) {
                    AfterEnter && AfterEnter(this.props);
                }
            }

            render() {
                const { Component } = this.state;
                return Component ? <Component {...this.props} /> : null;
            }
        };
    }

    /**
     * 处理路由配置
     *
     * @param {RouterConfig[]} conf
     * @returns {RouterHandleConfig[]}
     * @memberof RouterCreate
     */
    handleConfig(conf: RouterConfig[]): RouterHandleConfig[] {
        return conf.map(item => {
            const { path, component } = item;
            return {
                path,
                component: this.createRouterComponent(component)
            };
        });
    }

    /**
     * 生成路由列表
     *
     * @returns {JSX.Element[]}
     * @memberof RouterCreate
     */
    public render(): JSX.Element[] {
        return this.handleConfig(this.config).map((item, i) => {
            return (
                <Route
                    key={i}
                    path={item.path}
                    render={props =>
                        <item.component {...props} />
                    }
                />
            );
        });
    }
}
