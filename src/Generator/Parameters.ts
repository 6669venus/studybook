namespace Generator {

    export class Parameters {

        // grid
        public static GRID_HEIGHT = 10;
        public static CELL_SIZE = 64;
        public static CELL_STEPS = 4;

        // gravity
        public static GRAVITY = 2400;

        // player body dimensions
        public static PLAYER_BODY_WIDTH = 30;
        public static PLAYER_BODY_HEIGHT = 90;

        // jump height params
        public static HEIGHT_MIN = Parameters.CELL_SIZE * 0.75;
        public static HEIGHT_MAX = Parameters.CELL_SIZE * 2.90;
        public static HEIGHT_STEPS = 4;

        // horizontal speed
        public static VELOCITY_X = 300;

        // bounds for generating platforms
        public static UBOUND = 2;
        public static LBOUND = 8;
    }
}
