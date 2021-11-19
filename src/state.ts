/**
 * state object:
 * {}
 */

/*
{
    buttonPresses: [],
    states: [],
}

{
    functions:
    simulate(toTimestamp),
    rollback(toTimestamp), //
    addButtonPress // rolls back, adds button press, then simulates to the last timestamp.
    // we should have a gamestate.equals function, so we can test if two gamestates equal each other in actuality to determine if we need to rollback,
    // but that's actually stupid idk
}

buttonPress: {
    timestamp: number,
    type: "stateObject"
}
interface StampedState {
    timestamp: number,
    state: object
}

interface StampedButtonpress {
    timestamp: number,

}

module.exports = {
    simulate: (st: StampedState[], toTimestamp) => {
        let previousState = st[st.length - 1];
        let deltaTime = toTimestamp - previousState.timestamp;
        
    }
};
*/