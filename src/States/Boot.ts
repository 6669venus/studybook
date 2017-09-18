namespace GoblinRun {

    export class Boot extends Phaser.State {
 
        // -------------------------------------------------------------------------
        public create() {
            this.game.state.start("Preload");
        }
    }
}
