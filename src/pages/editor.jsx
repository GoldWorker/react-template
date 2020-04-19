import React, { Component } from 'react';
import { getConnectorList } from './data';
import { Select, Toast, Tab, Table, Paging } from 'slucky';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-github';
import { Menu, Icon } from 'antd';
import 'antd/es/menu/style/css';
const { SubMenu } = Menu;

// http://securingsincity.github.io/react-ace/
// https://www.npmjs.com/package/react-ace
// https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md
// https://www.npmjs.com/package/react-codemirror2
// https://blog.csdn.net/xieamy/article/details/79926995

export default class Job extends Component {
    componentDidMount() {
        getConnectorList({}).then(res => {
            console.log(res);
        });
    }

    handleChangePage = (currentPage) => {
        console.log(currentPage);
    }

    onChange = (newValue) => {
        console.log('change', newValue);
    }

    render() {
        const dataconf = [
            {
                title: 'Job',
                name: 'id',
                width: '20%'
            }, {
                title: 'runId',
                name: 'name',
                width: '20%'
            }, {
                title: '类型',
                name: 'height',
                width: '20%'
            },
            {
                title: '状态',
                name: 'height',
                width: '20%'
            },
            {
                title: '操作',
                width: '20%',
                name: 'action2',
                type: 'action',
                handles: [
                    {
                        name: '配置',
                        btnType: 'text',
                        handle: (data) => {
                            alert('配置');
                            console.log(data);
                        }
                    },
                    {
                        name: '删除',
                        btnType: 'text',
                        handle: (data) => {
                            alert('备注');
                            console.log(data);
                        }
                    }]
            }
        ];
        const dataset = [{
            id: 1,
            name: 'Apple',
            height: 178
        }, {
            id: 2,
            name: 'Boy',
            height: 177
        }, {
            id: 3,
            name: 'Cat',
            height: 176
        }];
        const pageInfo = {
            total: 119,
            maxToShow: 20
        };
        return (
            <div className="">
                <div className="d-f fullscreen">
                    <div className="s0" style={{ height: '100%' }}>
                        <div className="d-f fd-c" style={{ height: '100%' }}>
                            <div className="s0 ta-c ptb8 bor-r b-side">工具栏</div>
                            <Menu
                                onClick={this.handleClick}
                                style={{ width: 188, height: '100%' }}
                                mode="inline"
                            >
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>
                                            <Icon type="mail" />
                                            <span>Connector</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="/">123</Menu.Item>
                                    <Menu.Item key="/manager">asdf</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="/job">
                                   asdf123
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
                                    <Menu.Item key="10">Option 10</Menu.Item>
                                    <Menu.Item key="11">Option 11</Menu.Item>
                                    <Menu.Item key="12">Option 12</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </div>
                    </div>
                    <div className="flex1 ov-a">
                        <AceEditor
                            mode="mysql"
                            theme="github"
                            onChange={this.onChange}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                            highlightActiveLine={true}
                            style={{
                                width: '100%',
                                height: '100vh'
                            }}
                        />
                    </div>
                </div>
                
                {/* <Table dataconf={dataconf} dataset={dataset} />
                <div className="p16">
                    <Paging style="paging-aurora" pageInfo={pageInfo} onAction={this.handleChangePage} />
                </div> */}
            </div>
        );
    }
}
