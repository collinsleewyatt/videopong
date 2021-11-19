const stateF = require("./StateFunction");

let state1 = 0;
let state2 = 0;
test("State function is equal with respect to button presses", () => {
    for(let i = 0; i < 500; i++) {
        state1 = stateF(state1, 1);
    }
    
    for(let i = 0; i < 500; i+= 5) {
        state2 = stateF(state2, 5);
    }
    expect(state1).toEqual(state2);
})


