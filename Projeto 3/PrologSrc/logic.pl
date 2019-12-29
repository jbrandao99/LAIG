/*Check if board position is empty*/
checkPlay(Board, LineOut, ColumnOut) :-
    manageLine(Line),
    manageColumn(Column),
    isEmpty(Board, Line, Column, LineOut, ColumnOut).

isEmpty(Board, Line, Column, LineOut, ColumnOut) :-
    getValueFromMatrix(Board, Line, Column, Value),
    Value == empty,
    LineOut is Line,
    ColumnOut is Column.

isEmpty(Board, _Line, _Column, LineOut, ColumnOut) :-
    write('ERROR: cell not empty\n'),
    checkPlay(Board, LineOut, ColumnOut).

/*Check blocks of pieces together*/
checkSurroundings(_, 0, _, Board, Board, []).
checkSurroundings(_, _, 0, Board, Board, []).
checkSurroundings(_, 11, _, Board, Board, []).
checkSurroundings(_, _, 11, Board, Board, []).

checkSurroundings(Player, Line, Column, Board, FinalBoard, ListOfBlocks) :-
  getValueFromMatrix(Board, Line, Column, Value),
  Value == Player,
  replaceInMatrix(Board, Line, Column, empty, NewBoard),
  RightColumn is Column + 1,
  LineDown is Line + 1,
  LeftColumn is Column - 1,
  LineUp is Line - 1,
  checkSurroundings(Player, Line, RightColumn, NewBoard, NewBoard1, AuxListOfBlocks),
  checkSurroundings(Player, LineDown, Column, NewBoard1, NewBoard2, AuxListOfBlocks1),
  checkSurroundings(Player, Line, LeftColumn, NewBoard2, NewBoard3, AuxListOfBlocks2),
  checkSurroundings(Player, LineUp, Column, NewBoard3, FinalBoard, AuxListOfBlocks3),
  append([[Line, Column]], AuxListOfBlocks, Result),
  append(Result, AuxListOfBlocks1, Result1),
  append(Result1, AuxListOfBlocks2, Result2),
  append(Result2, AuxListOfBlocks3, ListOfBlocks).

checkSurroundings(_, _, _, Board, Board, []).

/*Get all blocks of pieces from Player*/
getPiecesBlocks(_, _, 11, _, []).

getPiecesBlocks(Board, Player, Line, 11, ListOfBlocks)  :-
  LineDown is Line + 1,
  getPiecesBlocks(Board, Player, LineDown, 1, ListOfBlocks).

getPiecesBlocks(Board, Player, Line, Column, ListOfBlocks) :-
  checkSurroundings(Player, Line, Column, Board, FinalBoard, AuxListOfBlocks),
  RightColumn is Column + 1,
  getPiecesBlocks(FinalBoard, Player, Line, RightColumn, AuxListOfBlocks1),
  append([AuxListOfBlocks], AuxListOfBlocks1, AuxListOfBlocks2),
  delete(AuxListOfBlocks2, [], ListOfBlocks).

/*Get coordinates of empty cells on Board*/
getEmptyCells(_,10,11,[]).

getEmptyCells(Board, Line, 11, ListOfMoves):-
    NewLine is Line+1,
    getEmptyCells(Board, NewLine, 1, ListOfMoves).

getEmptyCells(Board, Line, Column, ListOfMoves) :-
    getValueFromMatrix(Board, Line, Column, Value),
    (Value == empty ->
    Coordinates = [Line,Column];
    Coordinates = []),
    NewColumn is Column+1,
    getEmptyCells(Board, Line, NewColumn, AuxListOfMoves),
    append([Coordinates], AuxListOfMoves, ListOfMoves1),
    delete(ListOfMoves1, [], ListOfMoves).

/* Add Piece to the Board*/
addPiece(Piece, Player, Board, NewBoard, PlayerMode) :-
    value(Board, player1, Value1),
    value(Board, player2, Value2),
    printBoard(Board),
    write('\nScores:\n'),
    format('Player 1: ~w~n',[Value1]),
    format('Player 2: ~w~n',[Value2]),
    symbol(Piece, S),
    format('\n------------------ Player ~w - ~w -------------------\n', [Player, S]),
    (PlayerMode == 'P' ->
        checkPlay(Board, Line, Column);
    (PlayerMode == 'C0'; PlayerMode == 'C1') ->
        write('Estou a pensar...\n'),
        sleep(2),
        getEmptyCells(Board, 1, 1, ListOfMoves),
        length(ListOfMoves, Length),
        AuxLength is Length+1,
        random(1, AuxLength, Index),
        nth1(Index, ListOfMoves, Position),
        [Line,Column] = Position),
    replaceInMatrix(Board, Line, Column, Piece, NewBoard).

/*Add 4 initial blocking blocks*/
addBlocks(Board, FinalBoard, Player1, Player2, Player1Mode, Player2Mode) :-
    addPiece(block, Player1, Board, NewBoard, Player1Mode),
    addPiece(block, Player2, NewBoard, NewBoard1, Player2Mode),
    addPiece(block, Player1, NewBoard1, NewBoard2, Player1Mode),
    addPiece(block, Player2, NewBoard2, FinalBoard, Player2Mode).


/*Get Player valid moves*/

/*check possible move up*/
checkMoveUp(_,[],_,_,[]).

checkMoveUp(Board, [H|T], N, LineMin, MovePositions) :-
    [Line, Column] = H,
    NewLine is Line - 1 - N*2 - (Line - LineMin) * 2,
    NewLine > 0,
    NewLine < 11,
    getValueFromMatrix(Board, NewLine, Column, Value),
    Value == empty,
    checkMoveUp(Board, T, N, LineMin, AuxMovePositions),
    append([[NewLine, Column]], AuxMovePositions, MovePositions).

checkMoveUp(_,_,_,_,[]).

/*check possible move down*/
checkMoveDown(_,[],_,_,[]).

checkMoveDown(Board, [H|T], N, LineMax, MovePositions) :-
    [Line, Column] = H,
    NewLine is Line + 1 + N*2 + (LineMax - Line) * 2,
    NewLine > 0,
    NewLine < 11,
    getValueFromMatrix(Board, NewLine, Column, Value),
    Value == empty,
    checkMoveDown(Board, T, N, LineMax, AuxMovePositions),
    append([[NewLine, Column]], AuxMovePositions, MovePositions).

checkMoveDown(_,_,_,_,[]).

/*check possible move left*/
checkMoveLeft(_,[],_,_,[]).

checkMoveLeft(Board, [H|T], N, ColumnMin, MovePositions) :-
    [Line, Column] = H,
    NewColumn is Column - 1 - N*2 - (Column - ColumnMin) * 2,
    NewColumn > 0,
    NewColumn < 11,
    getValueFromMatrix(Board, Line, NewColumn, Value),
    Value == empty,
    checkMoveLeft(Board, T, N, ColumnMin, AuxMovePositions),
    append(AuxMovePositions, [[Line, NewColumn]], MovePositions).

checkMoveLeft(_,_,_,_,[]).

/*check possible move right*/
checkMoveRight(_,[],_,_,[]).

checkMoveRight(Board, [H|T], N, ColumnMax, MovePositions) :-
    [Line, Column] = H,
    NewColumn is Column + 1 + N*2 + (ColumnMax - Column) * 2,
    NewColumn > 0,
    NewColumn < 11,
    getValueFromMatrix(Board, Line, NewColumn, Value),
    Value == empty,
    checkMoveRight(Board, T, N, ColumnMax, AuxMovePositions),
    append(AuxMovePositions, [[Line, NewColumn]], MovePositions).

checkMoveRight(_,_,_,_,[]).

/*check if MovePositionsIn is a valid move by comparing its length with the block length, only valid if equal*/
checkWrongMove(_,[],[]).

checkWrongMove(BlockLength, MovePositionsIn, MovePositionsOut) :-
    length(MovePositionsIn, MoveLength),
    BlockLength == MoveLength,
    MovePositionsOut = MovePositionsIn.

checkWrongMove(_,_,[]).

/*get all valid moves up*/
getValidMovesUp(_,_,5,_,[]).

getValidMovesUp(Board, Block, N, LineMin, ListOfMoves) :-
    checkMoveUp(Board, Block, N, LineMin, MovePositions),
    N1 is N+1,
    length(Block, BlockLength),
    checkWrongMove(BlockLength, MovePositions, MovePositions1),
    getValidMovesUp(Board, Block, N1, LineMin, AuxListOfMoves),
    append([MovePositions1], AuxListOfMoves, ListOfMoves).

/*get all valid moves down*/
getValidMovesDown(_,_,5,_,[]).

getValidMovesDown(Board, Block, N, LineMax, ListOfMoves) :-
    checkMoveDown(Board, Block, N, LineMax, MovePositions),
    N1 is N+1,
    length(Block, BlockLength),
    checkWrongMove(BlockLength, MovePositions, MovePositions1),
    getValidMovesDown(Board, Block, N1, LineMax, AuxListOfMoves),
    append([MovePositions1], AuxListOfMoves, ListOfMoves).

/*get all valid moves left*/
getValidMovesLeft(_,_,5,_,[]).

getValidMovesLeft(Board, Block, N, ColumnMin, ListOfMoves) :-
    checkMoveLeft(Board, Block, N, ColumnMin, MovePositions),
    N1 is N+1,
    length(Block, BlockLength),
    checkWrongMove(BlockLength, MovePositions, MovePositions1),
    getValidMovesLeft(Board, Block, N1, ColumnMin, AuxListOfMoves),
    append([MovePositions1], AuxListOfMoves, ListOfMoves).

/*get all valid moves right*/
getValidMovesRight(_,_,5,_,[]).

getValidMovesRight(Board, Block, N, ColumnMax, ListOfMoves) :-
    checkMoveRight(Board, Block, N, ColumnMax, MovePositions),
    N1 is N+1,
    length(Block, BlockLength),
    checkWrongMove(BlockLength, MovePositions, MovePositions1),
    getValidMovesRight(Board, Block, N1, ColumnMax, AuxListOfMoves),
    append([MovePositions1], AuxListOfMoves, ListOfMoves).

/*get all valid moves*/

/*
ListOfMoves format:
[ 
    [ BlockOfPieces , [All valid moves for BlockOfPieces] ],
    [ BlockOfPieces1 , [All valid moves for BlockOfPieces1] ]
    ... 
]

Example:
[
    [ [[1,5]] , [ [[2,5]],[[4,5]],[[6,5]],[[8,5]],[[10,5]],[[1,10]] ] ],
    [ [[1,7]] , [ [[2,7]],[[4,7]],[[6,7]],[[8,7]],[[10,7]],[[1,10]] ] ]
    ...
]
*/
getValidMoves(_,_,[],[]).
    
getValidMoves(Board, Player, [H|T], ListOfMoves) :-
    getMinLine(H, 11, LineMin),
    getMaxLine(H, 0, LineMax),
    getMinColumn(H, 11, ColumnMin),
    getMaxColumn(H, 0, ColumnMax),
    getValidMovesUp(Board, H, 0, LineMin, AuxListOfMoves),
    getValidMovesDown(Board, H, 0, LineMax, AuxListOfMoves1),
    getValidMovesLeft(Board, H, 0, ColumnMin, AuxListOfMoves2),
    getValidMovesRight(Board, H, 0, ColumnMax, AuxListOfMoves3),
    getValidMoves(Board, Player, T, OtherBlockListOfMoves),
    append(AuxListOfMoves, AuxListOfMoves1, ListOfMoves1),
    append(AuxListOfMoves2, AuxListOfMoves3, ListOfMoves2),
    append(ListOfMoves1, ListOfMoves2, ListOfMoves3),
    delete(ListOfMoves3, [], ListOfMoves4),
    (ListOfMoves4 \= [] ->
        append([H], [ListOfMoves4], BlockListOfMoves),
        append([BlockListOfMoves], OtherBlockListOfMoves, ListOfMoves);
    append([], OtherBlockListOfMoves, ListOfMoves)).

valid_moves(Board, Player, ListOfMoves) :-
    getPiecesBlocks(Board, Player, 1, 1, ListOfBlocks),
    getValidMoves(Board, Player, ListOfBlocks, ListOfMoves).


/*Get number of moves*/
getNumberOfMoves([],0).
getNumberOfMoves([H|T], NumberOfMoves) :-
    [_|[Moves]] = H,
    length(Moves, N1),
    getNumberOfMoves(T, N2),
    NumberOfMoves is N1 + N2.

/*Check if move exists*/
checkMove(Move, NumberOfMoves) :-
    write('Move: '),
    read(MoveIn),
    doesMoveExist(MoveIn, NumberOfMoves, Move).

doesMoveExist(MoveIn, NumberOfMoves, MoveOut) :-
    integer(MoveIn),
    MoveIn > 0,
    MoveIn =< NumberOfMoves,
    MoveOut = MoveIn.

doesMoveExist(MoveIn, NumberOfMoves, MoveOut) :-
    format('ERROR: Move ~w does not exist~n',[MoveIn]),
    checkMove(MoveOut, NumberOfMoves).

/*Make move chosen by the user*/
makeMove([],_, AuxBoard, NewBoard) :- NewBoard = AuxBoard.
makeMove([H|T], Player, Board, NewBoard)  :-
    [Line,Column] = H,
    replaceInMatrix(Board, Line, Column, Player, AuxBoard),
    makeMove(T, Player, AuxBoard, NewBoard).

move([],_,_).
move([H|T], Board, NewBoard) :-
    Player = H,
    [Moves] = T,
    makeMove(Moves, Player, Board, NewBoard).

/*Get Move Positions after user inserted a move number (Move)*/
getMovePositions(Move, [H|_], MovePositions) :-
    [_|[Moves]] = H,
    length(Moves, Length),
    Length >= Move,
    nth1(Move, Moves, MovePositions).

getMovePositions(Move, [H|T], MovePositions) :-
    [_|[Moves]] = H,
    length(Moves, Length),
    Move1 is Move - Length,
    getMovePositions(Move1, T, MovePositions).

/*Print ListOfMoves and read Move from input*/
getMove(ListOfMoves, Move) :-
    printListOfMoves(ListOfMoves, 0),
    getNumberOfMoves(ListOfMoves, NumberOfMoves),
    checkMove(Move, NumberOfMoves).

/*Get the biggest block and its valid moves from ListOfMoves (2 blocks with same size, picks first)*/
getBiggestBlockMoves([], AuxBlockMoves, BlockMoves) :- BlockMoves = AuxBlockMoves.
getBiggestBlockMoves([H|T], AuxBlockMoves, BlockMoves) :-
    [AuxBlock|_] = AuxBlockMoves,
    [Block|_] = H,
    length(AuxBlock, AuxBlockLength),
    length(Block, BlockLength),
    BlockLength > AuxBlockLength,
    NewAuxBlockMoves = H,
    getBiggestBlockMoves(T, NewAuxBlockMoves, BlockMoves).

getBiggestBlockMoves([_|T], AuxBlockMoves, BlockMoves) :-
    getBiggestBlockMoves(T, AuxBlockMoves, BlockMoves).

/*Gets best move - choose move randomly from all the valid moves of the biggest (most valuable) block of pieces from Player on the Board*/
getBestMove(ListOfMoves, MovePositions) :-
    getBiggestBlockMoves(ListOfMoves, [[]], BlockMoves),
    [_|[Moves]] = BlockMoves,
    length(Moves, MovesLength),
    MovesLength1 is MovesLength+1,
    random(1, MovesLength1, Index),
    nth1(Index, Moves, MovePositions).

/*Choose move for bot*/
choose_move(Board, Level, Move) :-
    [Player|[Lvl]] = Level,
    valid_moves(Board, Player, ListOfMoves),
    (Lvl == '0' ->
        getNumberOfMoves(ListOfMoves, NumberOfMoves),
        AuxNumberOfMoves is NumberOfMoves+1,
        random(1, AuxNumberOfMoves, Index),
        getMovePositions(Index, ListOfMoves, MovePositions);
    Lvl == '1' ->
        getBestMove(ListOfMoves, MovePositions)),
    append([Player], [MovePositions], Move).

/*Play*/
play(Player, Board, NewBoard, PlayerMode) :-    
    value(Board, player1, Value1),
    value(Board, player2, Value2),
    valid_moves(Board, Player, ListOfMoves),
    length(ListOfMoves, Length),
    (Length > 0 ->
        printBoard(Board),
        write('\nScores:\n'),
        format('Player 1: ~w~n',[Value1]),
        format('Player 2: ~w~n',[Value2]),
        format('\n------------------ ~w -------------------\n', [Player]),
        (PlayerMode == 'P' ->
            getMove(ListOfMoves, Move),
            getMovePositions(Move, ListOfMoves, MovePositions),
            append([Player], [MovePositions], PlayerMove);
        (PlayerMode == 'C0'; PlayerMode == 'C1') ->
            write('Estou a pensar...\n'),
            sleep(2),
            sub_atom(PlayerMode, 1, 1, _, Level),
            append([Player], [Level], PlayerLevel),
            choose_move(Board, PlayerLevel, PlayerMove)),
        move(PlayerMove, Board, NewBoard);
        NewBoard = Board).


/*Get player score on a line of the board*/
valueLine([],_,0).
valueLine([H|T], Player, Value) :-
    (Player == H ->
    IsPiece = 1;
    IsPiece = 0),
    valueLine(T, Player, NewValue),
    Value is IsPiece + NewValue.

/*Get Player score (number of player pieces on the board) */
value([],_,0).
value([H|T], Player, Value) :-
    valueLine(H, Player, ValueLine),
    value(T, Player, NewValue),
    Value is ValueLine + NewValue.

/*No more valid moves, game ends and checks who the winner is*/
game_over(Board, Winner) :-
    value(Board, player1, Value1),
    value(Board, player2, Value2),
    (Value1 > Value2 ->
    Winner = player1;
    Value1 < Value2 ->
    Winner = player2;
    Winner = tie).

/*game Loop - check if there are any valid moves, if yes, player 1 plays then player 2 plays; if no, game over*/
gameLoop(Board, FinalBoard, Player1, Player2, Player1Mode, Player2Mode) :-
    valid_moves(Board, Player1, ListOfMoves),
    valid_moves(Board, Player2, ListOfMoves1),
    ((ListOfMoves \= []; ListOfMoves1 \= []) ->
        play(Player1, Board, NewBoard, Player1Mode),
        play(Player2, NewBoard, NewBoard1, Player2Mode),
        gameLoop(NewBoard1, FinalBoard, Player1, Player2, Player1Mode, Player2Mode);
        FinalBoard = Board).

/*Inicia um jogo*/
startGame(Player1, Player2, Player1Mode, Player2Mode) :- 
    initialBoard(Board),
    addBlocks(Board, NewBoard, Player1, Player2, Player1Mode, Player2Mode),
    addPiece(player1, Player1, NewBoard, NewBoard1, Player1Mode),
    addPiece(player2, Player2, NewBoard1, NewBoard2, Player2Mode),
    gameLoop(NewBoard2, FinalBoard, Player1, Player2, Player1Mode, Player2Mode),
    printBoard(FinalBoard),
    game_over(FinalBoard, Winner),
    value(FinalBoard, player1, Value1),
    value(FinalBoard, player2, Value2),
    winnerMenu(Winner, Value1, Value2).
    
    
    
    
