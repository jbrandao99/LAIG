manageLine(NewLine) :-
    readLine(Line),
    validateLine(Line, NewLine).

manageColumn(NewColumn) :-
    readColumn(Column),
    validateColumn(Column, NewColumn).

readLine(Line) :-
    write('Line (''A'' - ''J''): '),
    read(Line).

readColumn(Column) :-
    write('Column (1-10): '),
    read(Column).

validateLine('A', NewLine) :-
    NewLine = 1.

validateLine('B', NewLine) :-
    NewLine = 2.

validateLine('C', NewLine) :-
    NewLine = 3.

validateLine('D', NewLine) :-
    NewLine = 4.

validateLine('E', NewLine) :-
    NewLine = 5.

validateLine('F', NewLine) :-
    NewLine = 6.

validateLine('G', NewLine) :-
    NewLine = 7.

validateLine('H', NewLine) :-
    NewLine = 8.

validateLine('I', NewLine) :-
    NewLine = 9.

validateLine('J', NewLine) :-
    NewLine = 10.

validateLine(Line, NewLine) :-
    write('ERROR: '),
    write(Line),
    write(' is not valid!\n\n'),
    readLine(Input),
    validateLine(Input, NewLine).

validateColumn(1, NewColumn) :-
    NewColumn = 1.

validateColumn(2, NewColumn) :-
    NewColumn = 2.

validateColumn(3, NewColumn) :-
    NewColumn = 3.

validateColumn(4, NewColumn) :-
    NewColumn = 4.

validateColumn(5, NewColumn) :-
    NewColumn = 5.

validateColumn(6, NewColumn) :-
    NewColumn = 6.

validateColumn(7, NewColumn) :-
    NewColumn = 7.

validateColumn(8, NewColumn) :-
    NewColumn = 8.

validateColumn(9, NewColumn) :-
    NewColumn = 9.

validateColumn(10, NewColumn) :-
    NewColumn = 10.

validateColumn(Column, NewColumn) :-
    write('ERROR: '),
    write(Column),
    write(' is not valid!\n\n'),
    readColumn(Input),
    validateColumn(Input, NewColumn).