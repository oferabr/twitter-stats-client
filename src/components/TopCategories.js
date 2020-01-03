import React from 'react';
import '../styling/styles.css';
import { map, startCase } from 'lodash';

const TopCategories = ({results}) => (
    <div className="container">
        {map(results, result => categoryContainer(result))}
    </div>);

const categoryContainer = ({ title, values }) => (
    <div className="category">
        <p className="title">{startCase(title)}</p>
        {map(values, valuesDiv)}
    </div>
);

const valuesDiv = (value) => (<div className="result">
    <span>{value.value}, </span>
    <span className="occurrences">{value.occurrences}</span>
</div>);

export default TopCategories;