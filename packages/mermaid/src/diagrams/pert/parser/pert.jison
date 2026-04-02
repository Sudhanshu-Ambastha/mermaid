/* Lexical Grammar */
%lex
%options case-insensitive

%%
[\n\r\s]+                     /* skip whitespace */
"pert"                        return 'START';
"activity"                    return 'ACTIVITY';
"optimistic"                  return 'OPTIMISTIC';
"likely"                      return 'LIKELY';
"pessimistic"                 return 'PESSIMISTIC';
":"                           return 'COLON';
","                           return 'COMMA';
"-"                           return 'HYPHEN';

/* Handle Numbers */
[0-9]+(\.[0-9]+)?             return 'NUM';

/* Handle IDs for events */
[A-Za-z][A-Za-z0-9_]* return 'ID';

<<EOF>>                       return 'EOF';

/lex

%start start

%%

start
  : START statements EOF { return yy.getModel(); }
  | START EOF            { return yy.getModel(); }
  ;

statements
  : statement
  | statements statement
  ;

statement
  : ACTIVITY COLON activityList   { yy.setActivities($3); }
  | OPTIMISTIC COLON numList      { yy.setOptimistic($3); }
  | LIKELY COLON numList          { yy.setLikely($3); }
  | PESSIMISTIC COLON numList     { yy.setPessimistic($3); }
  ;

activityList
  : activityItem                  { $$ = [$1]; }
  | activityList COMMA activityItem { $1.push($3); $$ = $1; }
  ;

activityItem
  : eventIdentifier HYPHEN eventIdentifier  { $$ = { from: $1, to: $3 }; }
  ;

eventIdentifier
  : ID  { $$ = $1; }
  | NUM { $$ = $1; }
  ;

numList
  : NUM                             { $$ = [parseFloat($1)]; }
  | numList COMMA NUM               { $1.push(parseFloat($3)); $$ = $1; }
  ;