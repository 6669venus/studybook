namespace GoblinRun {

    const enum eGenerateState { PROCESS_PIECE, GENERATE_PIECE }

    export class MainLayer extends Phaser.Group {

        private _generator: Generator.Generator;

        private _wallsPool: Helper.Pool<Phaser.Sprite>;
        private _walls: Phaser.Group;

        private _lastTile: Phaser.Point = new Phaser.Point(0, 0);
        private _state: eGenerateState;

        // piece generated with generator
        private _piece: Generator.Piece = null;

        // -------------------------------------------------------------------------
        public render(): void {
            this._walls.forEachExists(function (sprite: Phaser.Sprite) {
                this.game.debug.body(sprite);
            }, this);
        }

        // -------------------------------------------------------------------------
        public constructor(game: Phaser.Game, parent: PIXI.DisplayObjectContainer) {
            super(game, parent);

            // platforms generator
            this._generator = new Generator.Generator(game.rnd);

            // pool of walls
            this._wallsPool = new Helper.Pool<Phaser.Sprite>(Phaser.Sprite, 32, function () {
                // add empty sprite with body
                let sprite = new Phaser.Sprite(game, 0, 0, "Block");
                game.physics.enable(sprite, Phaser.Physics.ARCADE);

                let body = <Phaser.Physics.Arcade.Body>sprite.body;
                body.allowGravity = false;
                body.immovable = true;
                body.moves = false;
                body.setSize(64, 64, 0, 0);

                return sprite;
            });

            // walls group
            this._walls = new Phaser.Group(game, this);

            // set initial tile for generating
            this._piece = this._generator.setPiece(0, 5, 10);
            this._state = eGenerateState.PROCESS_PIECE;
        }

        // -------------------------------------------------------------------------
        public generate(leftTile: number): void {
            // remove tiles too far to left
            this.cleanTiles(leftTile);

            // width of screen rounded to whole tiles up
            let width = Math.ceil(this.game.width / Generator.Parameters.CELL_SIZE);

            // generate platforms until we generate platform that ends out of the screen on right
            while (this._lastTile.x < leftTile + width) {

                switch (this._state) {

                    case eGenerateState.PROCESS_PIECE:
                        {
                            this._lastTile.copyFrom(this._piece.position);
                            let length = this._piece.length;

                            // process piece
                            while (length > 0) {
                                this.addBlock(this._lastTile.x, this._lastTile.y);

                                if ((--length) > 0) {
                                    ++this._lastTile.x;
                                }
                            }

                            // return processed piece into pool
                            this._generator.destroyPiece(this._piece);

                            // generate next platform
                            this._state = eGenerateState.GENERATE_PIECE;

                            break;
                        }


                    case eGenerateState.GENERATE_PIECE:
                        {
                            this._piece = this._generator.generate(this._lastTile);
                            this._state = eGenerateState.PROCESS_PIECE;
                            break;
                        }
                }
            }
        }

        // -------------------------------------------------------------------------
        private cleanTiles(leftTile: number): void {
            leftTile *= Generator.Parameters.CELL_SIZE;

            for (let i = this._walls.length - 1; i >= 0; i--) {
                let wall = <Phaser.Sprite>this._walls.getChildAt(i);

                if (wall.x - leftTile <= -64) {
                    this._walls.remove(wall);
                    wall.parent = null;
                    this._wallsPool.destroyItem(wall);
                }
            }
        }

        // -------------------------------------------------------------------------
        private addBlock(x: number, y: number): void {
            // sprite  get from pool
            let sprite = this._wallsPool.createItem();
            sprite.position.set(x * 64, y * 64);

            sprite.exists = true;
            sprite.visible = true;

            // add into walls group
            if (sprite.parent === null) {
                this._walls.add(sprite);
            }
        }
    }
}
