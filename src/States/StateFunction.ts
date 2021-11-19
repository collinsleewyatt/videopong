function state(previousState, deltaTime) {
    if(deltaTime == 5) {
        return previousState + 3;
    }
    return previousState + deltaTime;
}

module.exports = state;
