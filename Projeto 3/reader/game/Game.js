class Game{
    constructor(board, next, captures, turn, options, loaded, previous){
        this.client = new Client();

        // game state
        this.active_game =  false;
        this.game_mode;
        this.player_turn = false;
        this.winner;
        this.timer = 0;
        this.maxTime = 10;
        this.film = false;

        // array with all moves
        this.history = [];

        // previous game
        this.previous = previous || null;

        // game information required for server
        this.board = board || undefined;
        this.next = next || "Player1";

        this.turn = turn || 1;


        this.loaded = loaded || false;
        this.timeout = 2000;
    }

    init(mode) {
      if(!this.active_game && !this.film) {

          return this.reset().then(() => {

          this.game_mode = mode;
          this.active_game = true;
             if(mode == 1 || mode == 2) {
                 this.player_turn = true;
                 return null;
             }
             else {
                 return this.bot().then(() => this.player_turn = true);
             }
           });

     }
     return null;
    }

    getOptions() {
       let ret = "[";
       Object.keys(this.options).forEach(k => {
           ret += k + "(" + this.options[k] + "),";
       });
       ret = ret.slice(0, -1);
       ret += "]";
       return ret;
   }

   parseOptions(op) {
        let ret = {}
        let o = op.substr(1, op.length - 2);
        let re = /([a-z_]+\([\[\],a-z0-9]+\))/g;
        let m;
        while(m = re.exec(o)) {
            let a = m[0].toString().substr(0, m[0].length - 1).split('(');
            ret[a[0]] = a[1];
        }

        return ret;
    }

    updateGame(game,turn) {
        this.previous = this.clone();

        this.board = game;
        this.turn = turn+1;
        if((turn % 2)==0){
          this.next = "Player1";
        }
        else {
          this.next = "Player2";
        }

        this.timer = 0;
    }

    updateGame_replay(game,turn) {
        let game_parsed = this.parseGameString(game,turn);

        this.board = game_parsed.board;
        this.next = game_parsed.next;
    }

/*    parseGameString(game,turn) {

        let board = game;

        let turn = turn +1;

        if((turn % 2)==0){
          let next = "Player2";
        }
        else {
          let next = "Player1";
        }

        return {board: board, next: next, turn: turn};
    }*/

    move(R, C,turn) {

        if(this.next == "Player1"){
          return this.client.makeRequest("place_block_1(" + this.board + "," + R + "," + C + ")")
          .then(r => {
              if(this.active_game && r != "false") {
                  this.updateGame(r,turn);
                  this.history.push({row: R, col:C});
              }
              else if(this.film) {
                  this.updateGame_replay(r);
              }
          });
        }
        else{
        return this.client.makeRequest("place_block_2(" + this.board + "," + R + "," + C + ")")
        .then(r => {
            if(this.active_game && r != "false") {
                this.updateGame(r);
                this.history.push({row: R, col:C});
            }
            else if(this.film) {
                this.updateGame_replay(r);
            }
        });

    }
  }

    bot() {
       return this.client.makeRequest("bot(" + this + ")")
       .then( r => {
           if(this.active_game) {
               let previousBoard = this.board;
               this.updateGame(r);
               let currentBoard = this.board;
               this.history.push(this.botMoveCoord(previousBoard, currentBoard));
           }
           else if(this.film) {
               this.updateGame_replay(r);
           }
       })
   }

   botMoveCoord(previousBoard, currentBoard) {
        previousBoard = previousBoard.replace(/[,\[\]]/g, "");
        currentBoard = currentBoard.replace(/[,\[\]]/g, "");
        let coords;
        for(let i = 0; i < currentBoard.length; i++) {
            if(previousBoard[i] == "c" && currentBoard[i] != "c") {
                let c = Math.floor(i/this.options.board_size);
                coords =  {col: i - c * this.options.board_size + 1,
                            row: c + 1};
                return coords;
            }
        }
    }

    gameover() {
        return this.client.makeRequest("gameover(" + this.board + "," +this.turn+ ")")
        .then( r => {
            if(r == "false") return false;
            else {
                if(this.active_game) {
                    this.active_game = false;
                    this.winner = r;
                    this.timer = 0;
                }
                return r;
            }
        })
    }

    reset() {
        this.active_game = false;
        this.game_mode = undefined;
        this.player_turn = false;
        this.previous = null;
        this.winner = undefined;
        this.timer = 0;
        this.history = [];
        this.film = false;

        this.next = "Player1";
        this.captures = {Player1: "0", Player2: "0"};
        this.turn = 1;

        this.loaded = false;


            return this.client.makeRequest("initialBoard")
            .then(r => {
                this.board = r;
                this.loaded = true;
            })


    }

    undo() {
        if(this.player_turn && this.active_game) {
            if(this.game_mode == 1) {
                this.undo_aux();
            }
            else if(this.game_mode == 2) {
                this.undo_aux();
                this.undo_aux();
            }
            else if(this.game_mode == 3) {
                if(this.turn != "1") {
                    this.undo_aux();
                    this.undo_aux();
                }
            }
            return true;
        }
        return false;
    }

    undo_aux() {
        if(this.previous) {
            this.board       = this.previous.board;
            this.next        = this.previous.next;
            this.captures    = this.previous.captures;
            this.turn        = this.previous.turn;
            this.options     = this.previous.options;
            this.previous    = this.previous.previous;
            this.active_game = true;
            this.winner      = undefined;
            this.timer       = 0;
            if(this.history.length > 0) this.history.pop();
        }
    }

    replay(callback) {
        if(!this.active_game && this.winner) {
            this.film = true;
            let index = 0;

            let film = () => {
                setTimeout(callback, this.timeout, this.board, (this.timeout+2000));
                this.timeout += 2000;
                let move = this.history[index];
                index++;
                if(move) {
                    this.move(move.row, move.col)
                    .then(r => {film()});
                }
            }
            this.client.makeRequest("make_board(" + this.options.board_size + ")")
            .then(r => {
                this.board = r;
                this.next= "Player1";
                this.captures = {Player1: "0", Player2: "0"}
                film();
            })
        }
    }

    toString() {
       return "game(" + this.board
               + "," + this.next
               + ",[" + this.captures.Player1 + "," + this.captures.Player2 + "]"
               + "," + this.turn
               + "," + this.getOptions() + ")";
   }

   clone() {
       return new Game(this.board, this.next, this.captures,
                       this.turn, this.options, this.loaded,
                       this.previous);
   }

   update(deltaTime) {
        if(this.active_game) {
            let s = deltaTime / 1000;
            this.timer += s;
            if(this.timer >= this.maxTime) {
                this.active_game = false;
                this.winner = (this.next == "Player1") ? "Player2" : "Player1";
                this.timer = 0;
                return true;
            }
        }
        return false;
    }
}
