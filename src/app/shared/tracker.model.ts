export class Tracker {
    public id: number;
    public xCrd: number;
    public yCrd: number;
    public selected: boolean;
    public activated: boolean;
    public alias: string;
    public note: string;

    constructor(id: number, xCrd: number, yCrd: number) {
        this.id = id;
        this.xCrd = xCrd;
        this.yCrd = yCrd;
        this.selected = false;
        this.activated = true;
        this.alias = 'Tracker#' + id;
        this.note = 'This is a tracker';
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

    isActivated() {
        return this.activated;
    }
}
