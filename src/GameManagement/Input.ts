export interface Input {
    data: any;
    index?: number; // the index of the current input. Ensures that the list can be ordered in a consistent way
    // so if two inputs come at the same time, we are able to order them to prevent a desynchronization.
    onTick: number; // the tick that input occured on.
    type: string;
    uuid: string; // the uuid of the entity performing the command.
}