import React from "react"
import ReactClock from 'react-clock';

class Clock extends React.Component {
    constructor() {
        super()
        this.state = {
            date: new Date()
        }
    }

    componentDidMount() {
        setInterval(
            () => this.setState({ date: new Date() }),
            1000
        );
    }

    render() {
        return (
            <ReactClock value={this.state.date} />
        );
    }
}

export default Clock;