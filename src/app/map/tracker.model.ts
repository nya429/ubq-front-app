export class Tracker {
    public id: number;
    public xCrd: number;
    public yCrd: number;
    public selected: boolean;

    constructor(id: number, xCrd: number, yCrd: number) {
        this.id = id;
        this.xCrd = xCrd;
        this.yCrd = yCrd;
        this.selected = false;
    }
}
