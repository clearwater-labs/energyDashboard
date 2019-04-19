import React, { Component } from 'react'
import '../styles/App.scss'
import ScatterPlot from './ScatterPlot'
import { getStatCardData } from '../helpers/APIFrame'

class Home extends Component {
  constructor(props) {
    super(props)
    this.renderStats = this.renderStats.bind(this)
    this.state = {
      stats: [
        {
          interval: 'Daily',
          label: '--%'
        },
        {
          interval: 'Weekly',
          label: '--%'
        },
        {
          interval: 'Monthly',
          label: '--%'
        },
        {
          interval: 'Yearly',
          label: '--%'
        }
      ]
    }
  }

  componentDidMount() {
    setTimeout(() => {
      getStatCardData().then(res => {
        console.log(res)
      })
    }, 1000)
  }

  renderStats(statCards) {
    return (
      <div id="stats-container">
        {statCards.map((statCard, i) => (
          <div className="card" id="statCard" key={i}>
            <div className="card-content">
              <h5> {statCard.interval} </h5>
              <h4> {statCard.label} </h4>
            </div>
          </div>
        ))}
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
