export class Coordinate {
    x: number = 0;
    y: number = 0;
    letterIndex: number = -1;
    letter: string = "";
    isFixed: boolean = false;
}

export enum BrickType {
    Blank,
    Possible,
    Set,
    Fixed
}

export class Brick {
    brickType: BrickType = BrickType.Blank;
    letterIndex: number = -1;
    letter: string = "";
}

export class PlayingField {
    givenLetters: string[] = [];
    givenLetterIndexes: number[] = [];
    minX: number = 0;
    minY: number = 0;
    maxX: number = 0;
    maxY: number = 0;
    coordinates: Array<Coordinate> = new Array<Coordinate>();
    usedIndexes: number[] = [];
    language: string = "";

    removeUsedIndex(letterIndex: number) {
        var temp = [];
        for (let i = 0; i < this.usedIndexes.length; i++) {
            if (this.usedIndexes[i] != letterIndex) temp.push(this.usedIndexes[i]);
        }
        this.usedIndexes = temp;
    }

    isUsedLetter(letterIndex: number) {
        for (let i = 0; i < this.usedIndexes.length; i++) {
            if (this.usedIndexes[i] == letterIndex) return true;
        }
        return false;
    }

    setLetterIndex(x: number, y: number, letterIndex: number) {
        for (var i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i].x == x && this.coordinates[i].y == y) {
                this.removeUsedIndex(this.coordinates[i].letterIndex);
                this.coordinates[i].letterIndex = letterIndex;
                if (letterIndex >= 0)
                    this.usedIndexes.push(letterIndex);
                return;
            }
        }
        let coord = new Coordinate();
        coord.x = x;
        coord.y = y;
        coord.letterIndex = letterIndex;
        this.coordinates.push(coord);
        this.usedIndexes.push(letterIndex);
    }

    getCoordinate(x: number, y: number): Coordinate {
        for (var i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i].x == x && this.coordinates[i].y == y) {
                return this.coordinates[i];
            }
        }
        return null;
    }

    getXCoordArray(): Array<number> {
        let retArr = new Array<number>();
        for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
            retArr.push(x);
        }
        return retArr;
    }

    getYCoordArray(): Array<number> {
        let retArr = new Array<number>();
        for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
            retArr.push(y);
        }
        return retArr;
    }

    normalize() {
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        for (var i = 0; i < this.coordinates.length; i++) {
            // If no letter specified in current round (letterIndex=>0) and not fixed since previous
            // rounds - then continue.
            if (this.coordinates[i].letterIndex == -1 && !this.coordinates[i].isFixed)
                continue;

            if (this.coordinates[i].x < this.minX) this.minX = this.coordinates[i].x;
            if (this.coordinates[i].x > this.maxX) this.maxX = this.coordinates[i].x;
            if (this.coordinates[i].y < this.minY) this.minY = this.coordinates[i].y;
            if (this.coordinates[i].y > this.maxY) this.maxY = this.coordinates[i].y;
        }
    }

}
