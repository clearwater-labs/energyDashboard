import React, { Component } from 'react'
import '../styles/App.scss'
import { Spinner, Button, ButtonGroup } from 'reactstrap'
import { getGraphData, getBuildingEnergyTypes } from '../helpers/APIFrame'
import GraphNavigation from './GraphNavigation'
import { buildGraph } from '../helpers/GraphBuilder'

//const json2csv = require('json2csv')

class ScatterPlot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      energyType: 'electricity',
      data: '',
      mindate: '',
      maxdate: '',
      loading: true,
      filterBy: 'week',
      amountOfPoints: 0,
      updatingGraph: false,
      buttonUpdate: false,
      queryFilter: '',
      building: 'Davies',
      updateStatCardsData: this.props.functionUpdateStatsData,
      energyTypes: '',
      populateEnergyButtons: false,
      electricityButton: false,
      heatButton: false,
      chillerButton: false
    }

    this.handleEnergyButtons = this.handleEnergyButtons.bind(this)
    this.updateForBuilding = this.updateForBuilding.bind(this)
    this.getSettings = this.getSettings.bind(this)
    this.updateGraph = this.updateGraph.bind(this)
    this.drawGraph = this.drawGraph.bind(this)
    this.updateFromButton = this.updateFromButton.bind(this)
    this.downloadData = this.downloadData.bind(this)
    this.updateForEnergyType = this.updateForEnergyType.bind(this)
  }

  handleEnergyButtons(event) {
    console.log(event.target.value)
    this.setState({ energyType: event.target.value, buttonUpdate: true })
  }

  updateForBuilding(value) {
    this.setState({ building: value, buttonUpdate: true })
    this.state.updateStatCardsData(value)
  }

  updateFromButton(value) {
    // This value is from GraphNavigation
    this.setState({ filterBy: value, buttonUpdate: true })
  }

  updateForEnergyType() {
    this.setState({ buttonUpdate: true, populateEnergyButtons: true })
  }

  updateGraph() {
    this.getSettings().then(message => {
      getGraphData(
        this.state.amountOfPoints,
        this.state.queryFilter,
        this.state.building,
        this.state.energyType
      ).then(res => {
        this.setState({ data: res, updatingGraph: true })
      })
    })
  }

  downloadData() {
    var csvData = []
    var data = this.state.data.data.query.electricity.data
    csvData[0] = ['electricity', 'timestamp', 'value', '\n']
    var c = 1
    data.forEach(d => {
      csvData[c] = [new Date(+d.timestamp), d.value, '\n']
      c++
    })
    csvData[c] = '\n'

    var filename = this.state.building + '(' + this.state.filterBy + ').csv'
    var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename)
    } else {
      var link = document.createElement('a')
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  getSettings() {
    return new Promise((resolve, reject) => {
      if (this.state.filterBy === 'day') {
        this.setState({ amountOfPoints: 96, queryFilter: '' })
        resolve('Successfully set the correct amount of points and filter')
      } else if (this.state.filterBy === 'week') {
        this.setState({ amountOfPoints: 672, queryFilter: '' })
        resolve('Successfully set the correct amount of points and filter')
      } else if (this.state.filterBy === 'month') {
        this.setState({
          amountOfPoints: 2688 / 4,
          queryFilter: 'average: "hour"'
        })
        resolve('Successfully set the correct amount of points and filter')
      } else if (this.state.filterBy === 'year') {
        this.setState({ amountOfPoints: 365, queryFilter: 'average: "day"' })
        resolve('Successfully set the correct amount of points and filter')
      } else {
        reject('Something went wrong here!')
      }
    })
  }

  componentDidMount() {
    this.updateGraph()
  }

  componentDidUpdate() {
    if (this.state.populateEnergyButtons) {
      for (
        let i = 0;
        i < this.state.energyTypes.data.query.energyAvailable.length;
        i++
      ) {
        var energy = this.state.energyTypes.data.query.energyAvailable[i]
        if (energy === 'electricity') {
          this.setState({ electricityButton: true })
        } else if (energy === 'heat') {
          this.setState({ heatButton: true })
        } else if (energy === 'chiller') {
          this.setState({ chillerButton: true })
        }
      }

      this.setState({ populateEnergyButtons: false })
    }

    if (this.state.updatingGraph) {
      getBuildingEnergyTypes(this.state.building).then(res => {
        this.setState({
          updatingGraph: false,
          populateEnergyButtons: true,
          energyTypes: res
        })

        this.drawGraph(this.state.data)
      })
    } else if (this.state.buttonUpdate) {
      this.setState({ buttonUpdate: false })
      this.getSettings().then(message => {
        getGraphData(
          this.state.amountOfPoints,
          this.state.queryFilter,
          this.state.building,
          this.state.energyType
        ).then(res => {
          this.setState({ data: res, updatingGraph: true })
        })
      })
    }
  }

  drawGraph(results) {
    // Calls the Graph Builder Helper Method
    if (this.state.energyType === 'electricity') {
      buildGraph(
        results.data.query.electricity.data,
        this.state.queryFilter,
        this.state.amountOfPoints,
        this.state.filterBy
      )
    } else if (this.state.energyType === 'heat') {
      console.log(results)
      buildGraph(
        results.data.query.heat.data,
        this.state.queryFilter,
        this.state.amountOfPoints,
        this.state.filterBy
      )
    } else if (this.state.energyType === 'chiller') {
      buildGraph(
        results.data.query.chiller.data,
        this.state.queryFilter,
        this.state.amountOfPoints,
        this.state.filterBy
      )
    }

    // Removes the Spinner
    this.setState({ loading: false })
  }

  render() {
    let spinner
    if (this.state.loading) {
      spinner = (
        <div>
          <Spinner className="spinner" color="success" />
          <h3>Loading Data...</h3>
        </div>
      )
    } else {
      spinner = null
    }

    let electricity
    if (this.state.electricityButton) {
      electricity = (
        <div>
          <Button
            color="success"
            onClick={this.handleEnergyButtons}
            value="electricity"
          >
            Electricity
          </Button>
        </div>
      )
    } else {
      electricity = null
    }

    let heat
    if (this.state.heatButton) {
      heat = (
        <div>
          <Button
            color="success"
            onClick={this.handleEnergyButtons}
            value="heat"
          >
            Heat
          </Button>
        </div>
      )
    } else {
      heat = null
    }

    let chiller
    if (this.state.chillerButton) {
      chiller = (
        <div>
          <Button
            color="success"
            onClick={this.handleEnergyButtons}
            value="chiller"
          >
            Chiller
          </Button>
        </div>
      )
    } else {
      chiller = null
    }

    return (
      <div>
        <GraphNavigation
          functionFilter={this.updateFromButton}
          functionBuilding={this.updateForBuilding}
          functionDownloadData={this.downloadData}
          functionEnergyType={this.updateForEnergyType}
        />

        <div className="graphRow">
          <div className="card-graph">
            <ButtonGroup>
              {electricity}
              {heat}
              {chiller}
            </ButtonGroup>{' '}
            <div id="graphCard">
              <div className="scatterCard">
                <center>{spinner}</center>
                <div className="scatterPlotContainer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterPlot
