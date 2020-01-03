import axios from 'axios';
import '../styling/styles.css';
import React, { Component } from 'react';
import TopCategories from './TopCategories';
import { get, isEmpty, forOwn, startCase, filter, includes, map } from 'lodash';


class Stats extends Component {
    state = {
        query: '',
        topValues: [],
        tweetsPerSecond: 0,
        filteredTopValues: []
    };

    mapResponse = (response) => {
        let mappedResults = [];
        forOwn(response, (value, key,) => {
            mappedResults.push({
                    title: startCase(key),
                    values: value
                }
            );
        });
        return mappedResults;
    };
    getTopResults = () => axios.get(`http://localhost:3001/twitterStats/stats`)
        .then(({ data }) => this.setState({
            topValues: this.mapResponse(get(data, 'stats.topValues', {})),
            tweetsPerSecond: get(data, 'stats.tweetsPerSecond')
        }));

    filterResults = (query) => {
        const currentResults = this.state.topValues;
        const filtered = map(currentResults, current => ({
            title: current.title,
            values: filter(current.values, value => includes(value.value.toLowerCase(), query.toLowerCase()))
        }));
        this.setState({ filteredTopValues: filtered });
    };

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        }, () => {
            this.filterResults(this.state.query);
        });
    };
    getResultsToDisplay = () => {
        if (!isEmpty(this.state.query)) return this.state.filteredTopValues;
        return this.state.topValues;
    };

    displayResults = () => {
        return isEmpty(this.state.topValues) ? (<div>Nothing to display yet</div>)
            : (<div>Tweets Per Second: {this.state.tweetsPerSecond}
                <TopCategories results={this.getResultsToDisplay()}/>
            </div>)
    };

    render() {
        return (
            <div>
                <button className="resultButton" onClick={this.getTopResults}>Get Stats</button>
                <form>
                    {!isEmpty(this.state.topValues) && <input className="input"
                                                              placeholder="filter results"
                                                              ref={input => this.search = input}
                                                              onChange={this.handleInputChange}
                    />}
                </form>
                {this.displayResults()}
            </div>
        );
    }
}
export default Stats;
