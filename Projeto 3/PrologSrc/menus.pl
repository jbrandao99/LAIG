/*main menu*/
mainMenu :-
    printMainMenu,
    askMenuOption,
    read(Input),
    manageInput(Input).

/*manage input from menu option on mainMenu*/
manageInput(1) :-
    startGame(player1, player2, 'P', 'P').

manageInput(2) :-
    write('Computer 1\n'),
    askBotLevel(ComputerLevel),
    startGame(player1, player2, 'P', ComputerLevel).

manageInput(3) :-
    write('Computer 1\n'),
    askBotLevel(ComputerLevel1),
    write('\nComputer 2\n'),
    askBotLevel(ComputerLevel2),
    startGame(player1, player2, ComputerLevel1, ComputerLevel2).

manageInput(0) :-
    write('\nExiting...\n\n').

manageInput(_Other) :-
    write('ERROR: that option does not exist.\n'),
    askMenuOption,
    read(Input),
    manageInput(Input).

printMainMenu :-
    nl,nl,
    write(' _______________________________________________________________________ '),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|                 ____   _____   _____   _     __     __                |'),nl,
    write('|                |  __| |_   _| |  . _| | |    \\ \\   / /                |'),nl,
    write('|                | |__    | |   |  _ \\  | |__   \\ \\_/ /                 |'),nl,
    write('|                |____|   |_|   |_| \\_\\ |____|   \\___/                  |'),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|                             Joao Martins                              |'),nl,
    write('|                             Joao Brandao                              |'),nl,
    write('|               -----------------------------------------               |'),nl,
    write('|                                                                       |'),nl,
    write('|                                                                       |'),nl,
    write('|                          1. Player vs Player                          |'),nl,
    write('|                                                                       |'),nl,
    write('|                          2. Player vs Computer                        |'),nl,
    write('|                                                                       |'),nl,
    write('|                          3. Computer vs Computer                      |'),nl,
    write('|                                                                       |'),nl,
    write('|                          0. Exit                                      |'),nl,
    write('|                                                                       |'),nl,
    write('|_______________________________________________________________________|'),nl,nl,nl.

askMenuOption :-
    write('Insert your option: ').

/*Winner Menu (menu after game ends)*/
winnerMenu(Winner, Value1, Value2) :-
    printWinnerMenu(Winner, Value1, Value2),
    askMenuOption,
    read(WinnerOption),
    manageWinnerOption(WinnerOption).

manageWinnerOption(1) :-
    mainMenu.

manageWinnerOption(0) :-
    write('\nExiting...\n\n').

manageWinnerOption(_) :-
    write('\nERROR: that option does not exist.\n\n'),
    askMenuOption,
    read(WinnerOption),
    manageWinnerOption(WinnerOption).

printWinnerMenu(Winner, Value1, Value2) :-
    (Winner == player1 ->
    nl,nl,
    write(' _____________________________________________________________________________________ '),nl,
    write('|       _______   __       _______  __      __  ______   ________       ___           |'),nl,
    write('|      |   _   | |  |     |   _   | \\ \\    / / |  ____| |   __   |     /   |          |'),nl,
    write('|      |  |_|  | |  |     |  | |  |  \\ \\  / /  | |____  |  |__|  |    /_/| |          |'),nl,
    write('|      |   ____| |  |     |  |_|  |   \\ \\/ /   |  ____| |   _   _|       | |          |'),nl,
    write('|      |  |      |  |___  |   _   |    |  |    | |____  |  | \\  \\      __| |__        |'),nl,
    write('|      |__|      |______| |__| |__|    |__|    |______| |__|  \\__\\    |_______|       |'),nl,
    write('|                                                                                     |'),nl,
    write('|                        __        __   _____     _   _                               |'),nl,
    write('|                        \\ \\  /\\  / /  |_   _|   | \\ | |                              |'),nl,
    write('|                         \\ \\/  \\/ /     | |     |  \\| |                              |'),nl,
    write('|                          \\  /\\  /     _| |_    | |\\  |                              |'),nl,
    write('|                           \\/  \\/     |_____|   |_| \\_|                              |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                       Scores                                        |'),nl,
    write('|                                                                                     |'),nl,
    format('|                                    Player 1: ~w                                     |',[Value1]),nl,
    format('|                                    Player 2: ~w                                     |',[Value2]),nl,
    write('|                                                                                     |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                    1. Play Again                                    |'),nl,
    write('|                                    0. Exit                                          |'),nl,
    write('|                                                                                     |'),nl,
    write('|_____________________________________________________________________________________|'),nl,nl,nl;
    
    Winner == player2 ->
    nl,nl,
    write(' _____________________________________________________________________________________ '),nl,
    write('|       _______   __       _______  __      __  ______   ________      _____          |'),nl,
    write('|      |   _   | |  |     |   _   | \\ \\    / / |  ____| |   __   |    |  _  |         |'),nl,
    write('|      |  |_|  | |  |     |  | |  |  \\ \\  / /  | |____  |  |__|  |    |_|/ /          |'),nl,
    write('|      |   ____| |  |     |  |_|  |   \\ \\/ /   |  ____| |   _   _|      / /           |'),nl,
    write('|      |  |      |  |___  |   _   |    |  |    | |____  |  | \\  \\      / /__          |'),nl,
    write('|      |__|      |______| |__| |__|    |__|    |______| |__|  \\__\\    |_____|         |'),nl,
    write('|                                                                                     |'),nl,
    write('|                        __        __   _____     _   _                               |'),nl,
    write('|                        \\ \\  /\\  / /  |_   _|   | \\ | |                              |'),nl,
    write('|                         \\ \\/  \\/ /     | |     |  \\| |                              |'),nl,
    write('|                          \\  /\\  /     _| |_    | |\\  |                              |'),nl,
    write('|                           \\/  \\/     |_____|   |_| \\_|                              |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                       Scores                                        |'),nl,
    write('|                                                                                     |'),nl,
    format('|                                    Player 1: ~w                                     |',[Value1]),nl,
    format('|                                    Player 2: ~w                                     |',[Value2]),nl,
    write('|                                                                                     |'),nl,
    write('|                                                                                     |'),nl,
    write('|                                    1. Play Again                                    |'),nl,
    write('|                                    0. Exit                                          |'),nl,
    write('|                                                                                     |'),nl,
    write('|_____________________________________________________________________________________|'),nl,nl,nl;

    Winner == tie ->
    nl,nl,
    write(' __________________________________________________________________ '),nl,
    write('|                     _______   _____   ______                     |'),nl,
    write('|                    |__   __| |_   _| |  ____|                    |'),nl,
    write('|                       | |      | |   | |____                     |'),nl,
    write('|                       | |      | |   |  ____|                    |'),nl,
    write('|                       | |     _| |_  | |____                     |'),nl,
    write('|                       |_|    |_____| |______|                    |'),nl,
    write('|                                                                  |'),nl,
    write('|                                                                  |'),nl,
    write('|                              Scores                              |'),nl,
    write('|                                                                  |'),nl,
    format('|                           Player 1: ~w                           |',[Value1]),nl,
    format('|                           Player 2: ~w                           |',[Value2]),nl,
    write('|                                                                  |'),nl,
    write('|                                                                  |'),nl,
    write('|                           1. Play Again                          |'),nl,
    write('|                           0. Exit                                |'),nl,
    write('|                                                                  |'),nl,
    write('|__________________________________________________________________|'),nl,nl,nl).


/*Pick bot level*/
askBotLevel(Level) :-
    write('0. Level 0 - Random\n'),
    write('1. Level 1 - Picks move with more value\n'),
    askMenuOption,
    read(LevelOption),
    isValid(LevelOption, Level).

isValid(LevelOption, Level) :-
    (LevelOption == 1 ->
        Level = 'C1';
    LevelOption == 0 ->
        Level = 'C0';
    write('ERROR: that option does not exist.\n'),
    askMenuOption,
    read(NewLevelOption),
    isValid(NewLevelOption, Level)).
