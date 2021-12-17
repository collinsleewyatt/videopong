export default class Time {
    // the difference between the actual server time and our percieved definition of time
    offset: number;
    timeStart: number;
    constructor(currentTimeMillis: number = Date.now()) {
        this.offset = currentTimeMillis - Date.now(); 
    }

    startTimer(atTime: number) {
        this.timeStart = atTime;
    }

    getTimerValue() {
        return Date.now() + this.offset - this.timeStart;
    }

    synchronize(currentTimeMillis: number) {
        if(currentTimeMillis > this.getCurrentTime()) {
            this.offset = currentTimeMillis - Date.now(); 
        }
    }

    getCurrentTime() {
        return Date.now() + this.offset;
    }

}