var { buildSchema } = require('graphql')

var energySchema = buildSchema(`
    type Query { 
        query(building:String, average:String, sort:String, only:Int, baseIndex: Int, start:String, end:String): Building
    }

    type Building {
        electricity: DataValue
        solar: DataValue
        heat: DataValue
        chiller: DataValue
        energyRate: DataValue
        energyAvailable: [String]
        buildingData: BuildingData
    }

    type BuildingData {
        yearBuilt: Int
        size: Int
        buildingDesc: String
        buildingType: String
        buildingLongitude: String
        buildingLatitude: String
        cost: [MonthlyCost]
    }

    type MonthlyCost {
        month: Int
        year: Int
        onPeakRate: String
        offPeakRate: String
    }

    type DataValue {
        data: [TimeValue]
        stats: Stats
    }

    type TimeValue {
        timestamp: String
        value: Float
    }

    type Stats {
        daily: Stat
        weekly: Stat
        monthly: Stat
        yearly: Stat
    }

    type Stat {
        present: Float
        past: Float
    }

`)

module.exports = {
    "energySchema": energySchema
}