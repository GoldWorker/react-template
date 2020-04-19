import React, { Component } from 'react';
import { getConnectorList } from './data';
import { Select, Toast, Tab, Table, Paging } from 'slucky';
import NetFile from '../netFile';
import Validator from '../validator';

const PAGE_SIZE = 10;

export default class Connector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: '',
            b: 2
        };
        this.fileUpload = new NetFile({
            url: 'http://localhost:3000'
        });

        this.Validator = new Validator();
        Validator.types.isEmptyTest = {
            validate: (value) => {
                return value == this.state.b;
            },
            desc: 'test'
        };
        this.Validator.config = {
            a: ['isEmptyTest','isName']
        };
    }

    handleChangeFile = (e) => {
        const [file] = e.target.files;
        console.log(file, file.size);
        this.fileUpload.onProgress = (e, res) => {
            console.log(res.percent, res.chuncksPercent);
        };
        this.fileUpload.upload(file);

    }

    handleClick = () => {
        this.Validator.isSubmit(this.state);
        console.log(this.Validator.result);
    }


    render() {

        return (
            <div>
                <button onClick={this.handleClick}>test</button>
                <input type="file" name="" id="" onChange={this.handleChangeFile} />
            </div>
        );
    }
}
