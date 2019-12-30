:- consult('display.pl').
:- consult('menus.pl').
:- consult('logic.pl').
:- consult('input.pl').
:- consult('utils.pl').

:- use_module(library(lists)).
:- use_module(library(random)).
:- use_module(library(system)).

play :-
    mainMenu.