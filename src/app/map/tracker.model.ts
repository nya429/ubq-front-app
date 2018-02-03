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

    setCrd(x: number, y: number) {
        this.xCrd = x;
        this.yCrd = y;
    }

    _getCrd() {
        return {
            xCrd: this.xCrd,
            yCrd: this.yCrd
        };
    }

    isSelected() {
        return this.selected;
    }
}
