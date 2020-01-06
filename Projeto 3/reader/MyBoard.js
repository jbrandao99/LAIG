/**
 * MyBoard
 * @constructor
 */
class MyBoard extends CGFobject
{
    /**
     * @constructor
     * @param {CGFscene} scene
     */
	constructor(scene, p1_mat, p2_mat, preview_mat) {
        super(scene);
        this.scene.board = this;

        this.size = 10;

        this.board = new MyRectangle(this.scene,null, 0, this.size,0 , this.size);
        this.sensor = new MyPick(this.scene, 0.72);

        this.piecePreviewCoord = undefined;
        this.piecePreview = new MyPiece(this.scene, null);
        this.pieceP1 = new MyPiece(this.scene, null);
        this.pieceP2 = new MyPiece(this.scene, null);

        this.pieces = [];

        this.incrementPieceP1Row = 0;
        this.incrementPieceP1Col = 0;
        this.incrementPieceP2Row = 0;
        this.incrementPieceP2Col = 0;

        this.capturesPiecesP1 = 0;
        this.capturesPiecesP2 = 0;

        this.toPile = false;
    };
    /**
     * Converser a sensor id to the correspondent board coords
     * @param {Integer} id
     */
    sensorIdToCoord(id) {
        let c = Math.floor(id/this.size);
        return {row: id - c * this.size + 1,
                col: this.size - c};
    }

    /**
     * Picking handler
     */
    logPicking() {
        if(this.scene.pickMode == false) {
            if(this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for(let i = 0; i < this.scene.pickResults.length; i++) {
                    let sensor = this.scene.pickResults[i][0];
                    if(sensor) {
                        let coords = this.sensorIdToCoord(this.scene.pickResults[i][1]);
                        if(this.scene.mouseHoverEvent) {

                            this.piecePreviewCoord = {
                                row: coords.row - 1,
                                col: this.size - coords.col
                            };
                            this.scene.mouseHoverEvent = false;
                        } else {
                            this.scene.board_click(coords);
                        }
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
            else {
                if(this.scene.mouseHoverEvent) {
                    this.scene.mouseHoverEvent = false;
                    this.piecePreviewCoord = undefined;
                }
            }
        }
    }

    /**
     * Updates the board state with the server response board
     * @param {String} board
     */
    updateBoard(board,next) {
        let flag;

        for(let i = 0; i < (this.size*this.size)*2+21; i++) {

            flag = true;
            let t = Math.floor(i/this.size);
            let finalCoords = {row: t + 1, col: i - t*this.size + 1}
            for(let j = this.pieces.length - 1; j >= 0; j--) {
                if(finalCoords.row == this.pieces[j].finalCoords.row && finalCoords.col == this.pieces[j].finalCoords.col) {
                    flag = false;
                    if(board[i] == "e") {

                        if(this.pieces[j].piece == this.pieceP1){

                            this.pieces[j].initialCoords = JSON.parse(JSON.stringify(this.pieces[j].currentCoords));
                            this.pieces[j].finalCoords.row = 21.6 + this.incrementPieceP1Row;
                            this.pieces[j].finalCoords.col = 4 + this.incrementPieceP1Col;

                            if(this.incrementPieceP1Col == 4){
                                this.incrementPieceP1Col = 0;
                                this.incrementPieceP1Row = -1;
                            }
                            else{
                                this.incrementPieceP1Col++;
                            }

                            this.capturesPiecesP1++;
                        }
                        else{
                            this.pieces[j].initialCoords = JSON.parse(JSON.stringify(this.pieces[j].currentCoords));
                            this.pieces[j].finalCoords.row = 21.6 + this.incrementPieceP2Row;
                            this.pieces[j].finalCoords.col = 16.02 + this.incrementPieceP2Col;

                            if(this.incrementPieceP2Col == -4){
                                this.incrementPieceP2Col = 0;
                                this.incrementPieceP2Row = -1;
                            }
                            else{
                                this.incrementPieceP2Col--;
                            }
                            this.capturesPiecesP2++;
                        }
                        break;
                    } else if (board[i] == "a" || board[i] == "b" ) break;
                }
            }

            if(flag) {

                if(board[i] == "a") {
                    let initialCoordsP1 = {x: 20.4, y: -0.1, z: 1};
                    let initialCoordsP1_2 = JSON.parse(JSON.stringify(initialCoordsP1));
                    this.pieces.push({finalCoords: finalCoords, currentCoords: initialCoordsP1, initialCoords: initialCoordsP1_2,  piece: this.pieceP1});
											console.log(this.pieces);
                }
								else if(board[i] == "b") {
                    let initialCoordsP2 = {x: 20.4, y: 17.9, z: 1};
                    let initialCoordsP2_2 = JSON.parse(JSON.stringify(initialCoordsP2));
                    this.pieces.push({finalCoords: finalCoords, currentCoords: initialCoordsP2, initialCoords: initialCoordsP2_2, piece: this.pieceP2});
										console.log(this.pieces);
                }


            }
        }
    }

    /**
     * Updates pieces postions.
     */
    updatePieces(deltaTime){
        this.pieces.forEach(e => {
            let finalXYZCoords = {x: (e.finalCoords.row-1) *0.99, y: (this.size - e.finalCoords.col)*0.99, z: 0.2};
            let x_increment = deltaTime/200;
            let y_increment = deltaTime/200;

            if(Math.abs(finalXYZCoords.x-e.initialCoords.x) > Math.abs(finalXYZCoords.y-e.initialCoords.y)){
                y_increment = Math.abs(finalXYZCoords.y-e.initialCoords.y)*(deltaTime/200)/Math.abs(finalXYZCoords.x-e.initialCoords.x);

                let half = Math.abs(finalXYZCoords.x-e.initialCoords.x) / 2;
                if(Math.abs(finalXYZCoords.x-e.currentCoords.x) > half){
                    e.currentCoords.z += deltaTime/200;
                }
                else if(e.currentCoords.z > finalXYZCoords.z){
                    e.currentCoords.z -= deltaTime/200;
                }
                else{
                    e.currentCoords.z = finalXYZCoords.z;
                }
            }
            else{
                x_increment = Math.abs(finalXYZCoords.x-e.initialCoords.x)*(deltaTime/200)/Math.abs(finalXYZCoords.y-e.initialCoords.y);

                let half = Math.abs(finalXYZCoords.y-e.initialCoords.y) / 2;
                if(Math.abs(finalXYZCoords.y-e.currentCoords.y) > half){
                    e.currentCoords.z += deltaTime/200;
                }
                else if(e.currentCoords.z > finalXYZCoords.z){
                    e.currentCoords.z -= deltaTime/200;
                }
                else{
                    e.currentCoords.z = finalXYZCoords.z;
                }
            }

            if(Math.abs(finalXYZCoords.x-e.currentCoords.x) < deltaTime/200){
                e.currentCoords.x = finalXYZCoords.x;
            } else{
                if(finalXYZCoords.x > e.currentCoords.x){
                    e.currentCoords.x += x_increment;
                } else{
                    e.currentCoords.x -= x_increment;
                }
            }

            if(Math.abs(finalXYZCoords.y-e.currentCoords.y) < deltaTime/200){
                e.currentCoords.y = finalXYZCoords.y;
            } else{
                if(finalXYZCoords.y > e.currentCoords.y){
                    e.currentCoords.y += y_increment;
                } else{
                    e.currentCoords.y -= y_increment;
                }
            }
        })
    }

    /**
     * Resets current board state.
     */
    reset(){
        this.pieces.forEach(e => {
            if(e.piece == this.pieceP1){
                e.initialCoords = JSON.parse(JSON.stringify(e.currentCoords));
                e.finalCoords.row = 21.6;
                e.finalCoords.col = 19.1;
            }
            else{
                e.initialCoords = JSON.parse(JSON.stringify(e.currentCoords));
                e.finalCoords.row = 21.6;
                e.finalCoords.col = 0.92;
            }
        })
        this.capturesPiecesP1 = 0;
        this.capturesPiecesP2 = 0;
        this.incrementPieceP1Row = 0;
        this.incrementPieceP1Col = 0;
        this.incrementPieceP2Row = 0;
        this.incrementPieceP2Col = 0;
    }

    /**
     * Undo one move on board.
     */
    undoBoard(board){
        board = board.replace(/[,\[\]]/g, "");
        let flag;
        for(let i = 0; i < this.size*this.size; i++) {
            flag = true;
            let t = Math.floor(i/this.size);
            let finalCoords = {row: t + 1, col: i - t*this.size + 1}
            for(let j = this.pieces.length - 1; j >= 0; j--) {
                if(finalCoords.row == this.pieces[j].finalCoords.row && finalCoords.col == this.pieces[j].finalCoords.col) {
                    flag = false;
                    if(board[i] == "e") {
                        if(this.pieces[j].piece == this.pieceP1){
                            this.pieces[j].initialCoords = JSON.parse(JSON.stringify(this.pieces[j].currentCoords));
                            this.pieces[j].finalCoords.row = 21.6;
                            this.pieces[j].finalCoords.col = 19.1;
                        }
                        else{
                            this.pieces[j].initialCoords = JSON.parse(JSON.stringify(this.pieces[j].currentCoords));
                            this.pieces[j].finalCoords.row = 21.6;
                            this.pieces[j].finalCoords.col = 0.92;
                        }
                        break;
                    } else if (board[i] == "a" || board[i] == "b") break;
                }
            }
            if(flag) {

                    if(board[i] == "a") {
                        let initialCoordsP1 = {x: 20.4, y: -0.1, z: 1};
                        let initialCoordsP1_2 = JSON.parse(JSON.stringify(initialCoordsP1));
                        this.pieces.push({finalCoords: finalCoords, currentCoords: initialCoordsP1, initialCoords: initialCoordsP1_2,  piece: this.pieceP1});
                    }
                    else if(board[i] == "b") {
                        let initialCoordsP2 = {x: 20.4, y: 17.9, z: 1};
                        let initialCoordsP2_2 = JSON.parse(JSON.stringify(initialCoordsP2));
                        this.pieces.push({finalCoords: finalCoords, currentCoords: initialCoordsP2, initialCoords: initialCoordsP2_2, piece: this.pieceP2});
                    }

            }
        }
    }

    /**
     * Displays preview piece when mouse is over the board.
     */
    displayPreview() {
        if(this.piecePreviewCoord != undefined && this.scene.game.active_game) {
            this.scene.pushMatrix();
            this.scene.translate(0.6, 0.6, 0);
            this.scene.translate(this.piecePreviewCoord.row*0.99,
                                this.piecePreviewCoord.col*0.99,
                                0.2);
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.scene.scale(0.4, 0.4, 0.4);
            this.piecePreview.display();
            this.scene.popMatrix();
        }
    }

    /**
     * Displays all the current game pieces on board.
     */
    displayPieces() {
        this.pieces.forEach(e => {

            this.scene.pushMatrix();
            this.scene.translate(0.6, 0.6, 0);
            this.scene.translate(e.currentCoords.x, e.currentCoords.y, e.currentCoords.z);
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.scene.scale(0.4, 0.4, 0.4);
            e.piece.display();
            this.scene.popMatrix();
        });
    }

    /**
     * Displays the board.
     */
    display() {
        this.logPicking();

        this.scene.pushMatrix();
        this.scene.scale(0.192, 0.192, 0.192);
        this.scene.translate(0, 0, this.size);
        this.scene.rotate(-Math.PI/2, 1,0,0);

        if(this.scene.pickMode == false) {

            this.board.display();
            this.displayPreview();
            this.displayPieces();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(0.23, 0.3, 0);
            for(let i = 0; i < this.size; i++) {
                for(let j = 0; j < this.size; j++) {
                    this.scene.pushMatrix();
                    this.scene.translate(j*0.99, i*0.99, 0);
                    this.scene.registerForPick(j+i*this.size, this.sensor);
                    this.sensor.display();
                    this.scene.popMatrix();
                }
            }
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

    /**
     * Updates board texture coordenates.
     */
    updateTexCoords(s, t) {
        this.board.updateTexCoords(s, t);
    }

};
