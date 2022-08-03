export class Coordinate {
    x: number = 0;
    y: number = 0;
    letterIndex: number = -1;
}

export enum BrickType {
    Blank,
    Possible,
    Set
}

export class Brick {
    brickType: BrickType = BrickType.Blank;
    letterIndex: number = -1;
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
        if (x < this.minX) this.minX = x;
        if (y < this.minY) this.minY = y;
        if (x > this.maxX) this.maxX = x;
        if (y > this.maxY) this.maxY = y;

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
        console.log(this.coordinates);
    }

    getLetterIndex(x: number, y: number) {
        for (var i = 0; i < this.coordinates.length; i++) {
            if (this.coordinates[i].x == x && this.coordinates[i].y == y) {
                return this.coordinates[i].letterIndex;
            }
        }
        return -1;
    }


    getBrick(x: number, y: number): Brick {
        let brick = new Brick();
        if (this.usedIndexes.length == 0 && x == 0 && y == 0) {
            this.minX = 0;
            this.maxX = 0;
            this.minY = 0;
            this.maxY = 0;
            this.coordinates = [];
        }

        // If we don't have any values... then just say 0,0 is Possible!
        if (this.minX == 0 && this.maxX == 0 && this.minY == 0 && this.maxY == 0 &&
            x == 0 && y == 0 && this.coordinates.length == 0) {
            brick.brickType = BrickType.Possible;
            return brick;
        }

        var letterIndex = this.getLetterIndex(x, y);
        if (letterIndex >= 0) {
            brick.brickType = BrickType.Set;
            brick.letterIndex = letterIndex;
            return brick;
        }

        // We haven't specified anything yet... check if we've got a letter N/W/S/E of us...
        if (this.getLetterIndex(x - 1, y) >= 0 || this.getLetterIndex(x + 1, y) >= 0 ||
            this.getLetterIndex(x, y - 1) >= 0 || this.getLetterIndex(x, y + 1) >= 0) {
            brick.brickType = BrickType.Possible;
            return brick;
        }

        // We do not have a value, and our neighbours haven't got a value - we are blank!
        brick.brickType = BrickType.Blank;
        return brick;
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

}
