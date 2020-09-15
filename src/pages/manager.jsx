import React, { Component } from 'react';
import { getConnectorList } from './data';
import { Select, Toast, Tab, Table, Paging } from 'slucky';

const PAGE_SIZE = 10;

export default class Connector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            pageInfo: {
                total: 0,
                maxToShow: PAGE_SIZE
            },
            dataView: [],
            loading: true,
            count: 0
        };
    }

    getDataByList(currentPage = 1) {
        const index = (currentPage - 1) * PAGE_SIZE;
        const { dataList } = this.state;
        this.setState({
            dataView: dataList.slice(index, index + PAGE_SIZE),
            pageInfo: {
                currentPage,
                total: dataList.length,
                maxToShow: PAGE_SIZE
            }
        });
    }

    componentDidMount() {
        getConnectorList()
            .then(res => {
                console.log('res', res);
            }).catch(err => {
                console.log('err', err);
            });
    }

    handleChangePage = (currentPage) => {
        this.getDataByList(currentPage);
    };

    render() {
        const dataconf = [
            {
                title: 'connector',
                name: 'name',
                width: '20%',
                pipe: (data) => {
                    return <span className="ptb2 plr8 bor b-side-s">{data['name']}</span>;
                }
            },
            {
                title: 'driver',
                name: 'driver',
                width: '20%'
            },
            {
                title: 'type',
                name: 'type',
                width: '20%',
                pipe: (data) => {
                    return <span className="ptb2 plr8 bor c-theme">{data['type']}</span>;
                }
            },
            {
                title: 'realTime',
                name: 'realTime',
                width: '20%'
            },
            {
                title: '配置详情',
                name: 'config',
                width: '20%',
                pipe: (data) => {
                    return (
                        <div className="pop-box d-b">
                            <div className="pop-toggle">
                                <div className="ellip2 pr16">{JSON.stringify(data['config'])}</div>
                                <div className="pop-main pl8">
                                    <div className="pop-content p24 bg-w ta-l shadow fs14 w512">
                                        <pre>Config</pre>
                                        <div>{JSON.stringify(data['config'])}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        ];

        return (
            <div>
                <Table dataconf={dataconf} dataset={this.state.dataView} loading={this.state.loading} />
                <div className="p16">
                    <Paging style="paging-aurora" pageInfo={this.state.pageInfo} onAction={this.handleChangePage} />
                </div>
            </div>
        );
    }
}

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 1
        };
    }

    componentWillMount() {
        this.setState({ num: 2 });
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps');
    }

    onClick() {
        this.setState({ num: this.state.num + 1 });
    }

    render() {
        return (
            <div>
                <CounterChild num={this.state.num} />
            </div>
        );
    }
}

class CounterChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 1
        };
    }

    componentWillMount() {
        console.log('CounterChild componentWillMount');
    }

    componentWillReceiveProps() {
        console.log('CounterChild componentWillReceiveProps');
    }

    onClick() {
        this.setState({ num: this.state.num + 1 });
    }

    render() {
        return (
            <div>
                <h1>Pcount: {this.props.num}</h1>
                <h1>count: {this.state.num}</h1>
                <button onClick={() => this.onClick()}>add</button>
            </div>
        );
    }
}
