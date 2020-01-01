class Pente{
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
        this.next = next || " Player1";
        this.captures = captures || {Player1: "0", Player2: "0"};
        this.turn = turn || "0";
        this.options = options || {};

        this.loaded = loaded || false;
        this.timeout = 2000;
    }

    init(mode, options) {
        if(!this.active_game && !this.film) {
            return this.reset(options).then(() => {
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

    updateGame(game) {
        this.previous = this.clone();
        let game_parsed = this.parseGameString(game);

        this.board = game_parsed.board;
        this.next = game_parsed.next;
        this.captures = game_parsed.captures;
        this.turn = game_parsed.turn;
        this.options = game_parsed.options;
        this.timer = 0;
    }

    updateGame_replay(game) {
        let game_parsed = this.parseGameString(game);

        this.board = game_parsed.board;
        this.next = game_parsed.next;
        this.captures = game_parsed.captures;
    }

    parseGameString(game) {
        let board_re = /\[(\[([cwb][,]?)+\][,]?)+\]/;
        let board = board_re.exec(game)[0];
        game = game.slice(game.search("]],") + 3, game.length);
        let next = game[0];
        game = game.slice(2, game.length);

        let captures = {w: game.substring(1, game.indexOf(',')),
                        b: game.substring(game.indexOf(',') + 1, game.indexOf(']'))};
        game = game.slice(game.indexOf(']') + 2, game.length);

        let turn = game.substring(0, game.indexOf(','));
        game = game.slice(game.indexOf(',') + 1, game.length - 1);

        let options = this.parseOptions(game);

        return {board: board, next: next, captures: captures, turn: turn, options: options};
    }

    move(R, C) {
        return this.client.makeRequest("move(" + this + ",[" + R + "," + C + "])")
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
