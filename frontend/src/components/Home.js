import React, { Component } from 'react'
import '../styles/App.scss'
import ScatterPlot from './ScatterPlot'
import { getDaily } from '../helpers/APIFrame'

class Home extends Component {
  constructor(props) {
    super(props)
    this.renderStats = this.renderStats.bind(this)
    this.state = {
      stats: [
        {
          interval: 'Daily',
          dailyLabel: ''
        },
        {
          interval: 'Weekly',
          weeklyLabel: ''
        },
        {
          interval: 'Monthly',
          monthlyLabel: ''
        },
        {
          interval: 'Yearly',
          yearlyLabel: ''
        }
      ]
    }
  }

componentDidMount(){
  getDaily().then((result) => {
    console.log(result.data)
  })
}

  renderStats(statCards) {
    return (
      <div id="stats-container">
          <div className="card" id="statCard">
            <div className="card-content">
              <h5> {this.state.stats[0].interval} </h5>
              <h4> {this.state.stats[0].dailyLabel} </h4>
            </div>
          </div>
          <div className="card" id="statCard">
            <div className="card-content">
              <h5> {this.state.stats[1].interval} </h5>
              <h4> {this.state.stats[1].dailyLabel} </h4>
            </div>
          </div>
          <div className="card" id="statCard">
            <div className="card-content">
              <h5> {this.state.stats[2].interval} </h5>
              <h4> {this.state.stats[2].dailyLabel} </h4>
            </div>
          </div>
          <div className="card" id="statCard">
            <div className="card-content">
              <h5> {this.state.stats[3].interval} </h5>
              <h4> {this.state.stats[3].dailyLabel} </h4>
            </div>
          </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div className="centered">
          <ScatterPlot graphName="graph1" />
        </div>
        <div className="cards" id="statCards">
            {this.renderStats(this.state.stats)}
        </div>
      </div>
    )
  }
}

export default Home
