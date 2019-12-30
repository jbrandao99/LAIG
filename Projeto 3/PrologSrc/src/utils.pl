/*replace [Line, Column] position on the board*/
replaceInList([_H|T], 1, Value, [Value|T]).

replaceInList([H|T], Index, Value, [H|TNew]) :-
        Index > 1,
        Index1 is Index - 1,
        replaceInList(T, Index1, Value, TNew).

replaceInMatrix([H|T], 1, Column, Value, [HNew|T]) :-
        replaceInList(H, Column, Value, HNew).

replaceInMatrix([H|T], Line, Column, Value, [H|TNew]) :-
        Line > 1,
        Line1 is Line - 1,
        replaceInMatrix(T, Line1, Column, Value, TNew).

/*get Value from Board*/
getValueFromList([H|_T], 1, Value) :-
        Value = H.

getValueFromList([_H|T], Index, Value) :-
        Index > 1,
        Index1 is Index - 1,
        getValueFromList(T, Index1, Value).

getValueFromMatrix([H|_T], 1, Column, Value) :-
        getValueFromList(H, Column, Value).

getValueFromMatrix([_H|T], Line, Column, Value) :-
        Line > 1,
        Line1 is Line - 1,
        getValueFromMatrix(T, Line1, Column, Value).

/*Get Min Line from block of pieces*/
getMinLine([], AuxMin, Min) :-
        Min = AuxMin.

getMinLine([H|T], AuxMin, Min) :-
        nth0(0, H, A),
        AuxMin > A,
        getMinLine(T, A, Min).

getMinLine([_|T], AuxMin, Min) :-
        getMinLine(T, AuxMin, Min).

/*Get Max Line from block of pieces*/
getMaxLine([], AuxMax, Max) :-
        Max = AuxMax.

getMaxLine([H|T], AuxMax, Max) :-
        nth0(0, H, A),
        AuxMax < A,
        getMaxLine(T, A, Max).

getMaxLine([_|T], AuxMax, Max) :-
        getMaxLine(T, AuxMax, Max).

/*Get Min Column from block of pieces*/
getMinColumn([], AuxMin, Min) :-
        Min = AuxMin.

getMinColumn([H|T], AuxMin, Min) :-
        nth0(1, H, A),
        AuxMin > A,
        getMinColumn(T, A, Min).

getMinColumn([_|T], AuxMin, Min) :-
        getMinColumn(T, AuxMin, Min).

/*Get Max Column from block of pieces*/
getMaxColumn([], AuxMax, Max) :-
        Max = AuxMax.

getMaxColumn([H|T], AuxMax, Max) :-
        nth0(1, H, A),
        AuxMax < A,
        getMaxColumn(T, A, Max).

getMaxColumn([_|T], AuxMax, Max) :-
        getMaxColumn(T, AuxMax, Max).
        
