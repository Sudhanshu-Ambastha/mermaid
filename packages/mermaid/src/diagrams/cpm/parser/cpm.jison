/* Lexical Grammar */
%lex
%options case-insensitive

%%
[\n\r\s]+                         /* skip all whitespace and newlines */
"cpm"                             return 'START';
"activity"                        return 'ACTIVITY';
"duration"                        return 'DURATION';
"predecessor"                     return 'PREDECESSOR';
":"                               return 'COLON';
","                               return 'COMMA';
";"                               return 'SEMI';
"_"                               return 'EMPTY';

/* Handle IDs (A, B, Task_1) */
[A-Za-z_][A-Za-z0-9_]* return 'ID';

/* Handle Numbers (2, 8, 4.5) */
[0-9]+(\.[0-9]+)?                 return 'NUM';

<<EOF>>                           return 'EOF';

/lex

%start start

%%

start
  : START statements EOF { return yy.getModel(); }
  ;

statements
  : statement
  | statements statement
  ;

statement
  : ACTIVITY COLON idList      { yy.setActivities($3); }
  | DURATION COLON numList     { yy.setDurations($3); }
  | PREDECESSOR COLON predList { yy.setPredecessors($3); }
  ;

idList
  : ID                { $$ = [$1]; }
  | idList COMMA ID   { $1.push($3); $$ = $1; }
  ;

numList
  : NUM                { $$ = [parseFloat($1)]; }
  | numList COMMA NUM  { $1.push(parseFloat($3)); $$ = $1; }
  ;

predList
  : predItem                { $$ = [$1]; }
  | predList COMMA predItem  { $1.push($3); $$ = $1; }
  ;

predItem
  : EMPTY             { $$ = []; }
  | ID                { $$ = [$1]; }
  | ID SEMI ID        { $$ = [$1, $3]; }
  ;