export class DataSeries{
    constructor() {
        this.m_dataPoints = [];
        this.cursor = 0;
        this.observer = null;
    }

    get dataPoints() {
        return this.m_dataPoints;
    }

    addAcceleroData(x,y,z) {
        this.m_dataPoints[cursor].accelero = { X: x, Y: y, Z: z };
    }

    addGyroData(x,y,z) {
        this.m_dataPoints[cursor].gyro = { X: x, Y: y, Z: z };
    }

    addMagnetoData(x,y,z) {
        this.m_dataPoints[cursor].magneto = { X: x, Y: y, Z: z };
    }

    isDataPointComplete() {
        if(this.m_dataPoints[this.cursor].gyro != undefined &&
            this.m_dataPoints[this.cursor].accelero != undefined &&
            this.m_dataPoints[this.cursor].magneto != undefined) {

            if(this.isDataPointComplete())
                this.cursor++;
            
            if(this.m_dataPoints[cursor] == undefined)
                this.m_dataPoints[cursor] = {};
        }
    }
};