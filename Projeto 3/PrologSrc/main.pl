% ***** Libraries

% Generating integers
:- use_module(library(between)).
% Basic operations on lists
:- use_module(library(lists)).
% Random
:- use_module(library(random)).
% Sleep
:- use_module(library(system)).
% Sorting
:- use_module(library(samsort)).

% ***** User

% Library extensions
:- compile('src/ctrlv.pl').
:- compile('src/display.pl').
:- compile('src/input.pl').
:- compile('src/logic.pl').
:- compile('src/menus.pl').
:- compile('src/utils.pl').
