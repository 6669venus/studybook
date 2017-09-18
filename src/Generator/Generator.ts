namespace Generator {

    export const UNDEFINED = -10000;

    export class Generator {

        private _rnd: Phaser.RandomDataGenerator;
        private _jumpTables: JumpTables;

        private _piecesPool: Helper.Pool<Piece>;

        private _lastGeneratedPiece: Piece = null;

        // -------------------------------------------------------------------------
        public constructor(rnd: Phaser.RandomDataGenerator) {
            // random numbers generator
            this._rnd = rnd;

            // reference to jump tables
            this._jumpTables = JumpTables.instance;

            // pool of pieces
            this._piecesPool = new Helper.Pool<Piece>(Piece, 16);
        }

        // -------------------------------------------------------------------------
        private createPiece(): Piece {
            let piece = this._piecesPool.createItem();

            if (piece === null) {
                console.error("No free pieces in pool");
            }

            return piece;
        }

        // -------------------------------------------------------------------------
        public destroyPiece(piece: Piece): void {
            this._piecesPool.destroyItem(piece);
        }

        // -------------------------------------------------------------------------
        public setPiece(x: number, y: number, length: number, offsetX: number = 0, offsetY: number = 0): Piece {
            let piece = this.createPiece();

            piece.position.set(x, y);
            piece.offset.set(offsetX, offsetY);
            piece.length = length;

            return piece;
        }

        // -------------------------------------------------------------------------
        public generate(lastPosition: Phaser.Point): Piece {

            let piece = this.createPiece();

            let ubound = Parameters.UBOUND;
            let lbound = Parameters.LBOUND;


            // Y POSITION
            // how high can jump max
            let minY = this._jumpTables.maxOffsetY();
            // how deep can fall max
            let maxY = lbound - ubound;

            // clear last y from upper bound, so it starts from 0
            let currentY = lastPosition.y - ubound;

            // new random y position - each y level on screen has the same probability
            let shiftY = this._rnd.integerInRange(0, lbound - ubound);
            // substract currentY from shiftY - it will split possible y levels to negative
            // (how much step up (-)) and positive (how much to step down (+))
            shiftY -= currentY;
            // clamp step to keep it inside interval given with maximum 
            // jump offset up (minY) and maximum fall down (maxX)
            shiftY = Phaser.Math.clamp(shiftY, minY, maxY);

            // new level for platform
            // limit once more against game limits (2 free tiles on top, 1 water tile at bottom)
            let newY = Phaser.Math.clamp(currentY + shiftY, 0, lbound - ubound);

            // shift by upper bound to get right y level on screen
            piece.position.y = newY + ubound;
            // offset of new piece relative to last position (end position of last piece)
            piece.offset.y = piece.position.y - lastPosition.y;


            // X POSITION
            let minX = this._jumpTables.minOffsetX(piece.offset.y);
            let maxX = this._jumpTables.maxOffsetX(piece.offset.y);

            // position of next tile in x direction
            let shiftX = this._rnd.integerInRange(minX, maxX);

            // new absolute x position
            piece.position.x = lastPosition.x + shiftX;
            // offset of new piece relative to last position (end position of last piece)
            piece.offset.x = shiftX;


            // LENGTH
            piece.length = this._rnd.integerInRange(3, 5);


            // RESULT
            this._lastGeneratedPiece = piece;
            return piece;
        }
    }
}
