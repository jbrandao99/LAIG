initialBoard([
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty],
[empty,empty,empty,empty,empty,empty,empty,empty,empty,empty]
]).

symbol(empty,S) :- S=' '.
symbol(player1,S) :- S='A'.
symbol(player2,S) :- S='B'.
symbol(block,S) :- S='#'.

letter(1, L) :- L='A'.
letter(2, L) :- L='B'.
letter(3, L) :- L='C'.
letter(4, L) :- L='D'.
letter(5, L) :- L='E'.
letter(6, L) :- L='F'.
letter(7, L) :- L='G'.
letter(8, L) :- L='H'.
letter(9, L) :- L='I'.
letter(10, L) :- L='J'.

printBoard(Board) :-
    nl,
    write('   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10|\n'),
    write('---|---|---|---|---|---|---|---|---|---|---|\n'),
    printMatrix(Board, 1).

printMatrix([], 11).

printMatrix([Head|Tail], N) :-
    letter(N, L),
    write(' '),
    write(L),
    N1 is N + 1,
    write(' | '),
    printLine(Head),
    write('\n---|---|---|---|---|---|---|---|---|---|---|\n'),
    printMatrix(Tail, N1).

printLine([]).

printLine([Head|Tail]) :-
    symbol(Head, S),
    write(S),
    write(' | '),
    printLine(Tail).

/*Change Line Numbers to Letters*/
getBoardPosition([],[]).
getBoardPosition([H|T], BoardPosition) :-
    [Line, Column] = H,
    letter(Line, Letter),
    getBoardPosition(T, BoardPosition1),
    append([[Letter,Column]], BoardPosition1, BoardPosition).


/*Prints blocks of pieces and its corresponding valid moves so player can choose one*/
printMoves([],_).
printMoves([H|T], N) :-
    N1 is N+1,
    getBoardPosition(H, BoardMove),
    format('~w - ~w~n', [N1, BoardMove]),
    printMoves(T, N1).

printListOfMoves([],_).
printListOfMoves([H|T], N) :-
    [Block, Moves] = H,
    write('Block: '),
    getBoardPosition(Block, BoardBlock),
    write(BoardBlock), nl,
    printMoves(Moves, N), nl,
    length(Moves, MovesLength),
    N1 is N+MovesLength,
    printListOfMoves(T, N1).
