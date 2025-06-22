# Degaaper

Degapper は、プログラミングの教科書に潜んでいる"Gap" （あるプログラムを理解するときに、新しい要素が一度にたくさん出てきて理解しにくくなること）
を発見するツールです

現在、JavaとCとProcessingに対応しています(対応していない文法があるかもしれません）。

## 動作環境

jre6以降が動く環境

## 準備

あらかじめ、一冊の教科書（教材）のプログラムファイルを、フォルダ名＋ファイル名でソート(ソート時に拡張子 .cや.java は取り除いて比較される)したときに教科書の出現順になるようにしてください。
章番号などでフォルダ分けしている場合は 「1」ではなく「01」などのように、桁数をあわせてください。

また、解析の対象から外すファイルは、excludeという名前のフォルダに入れておいてください。

## 実行

一冊の教科書の解析を行うには、**ParseAndCheck.bat を実行してください。
(**にはC,J(Java),Pr(Processing)が入ります)

% CParseAndCheck <folder>
% JParseAndCheck <folder>
% PrParseAndCheck <folder>

<folder>に対して、以下のCParser/JParser/PrParserとCheckを順番に実行します。

<folder>で指定されたフォルダ（サブフォルダ含む）の中にあるソースファイルを構文解析し、結果をxmlに保存します。
例えば、foo.c の解析結果は xml/foo.c.xml に保存されます。
構文エラーがあったファイルは、 xml/!ERROR_foo.c.txt に保存されます

全体の解析結果は<floder>/report.htmlに出力されます．

## report.html の見方


report.htmlでは、それぞれのプログラムについて、この教科書（教材）で
初めて習う概念をハイライト表示します。

例：

sample/Cprog1/report.html の2番めのプログラムを例にとって説明します


~~~
//#include<stdio.h>

int main(void) {
   printf("2 たす 3 は %d です", 2+3);
}
5 new elements: (5 major(3 tailPath), 0 minor)

New concepts appear in 02_keisan

toggle minor
02_keisan-1: program/全体/関数定義/複合文/式文/後置式/引数リスト                         
02_keisan-2: program/全体/関数定義/複合文/式文/後置式/引数リスト/加法式
02_keisan-3: program/全体/関数定義/複合文/式文/後置式/引数リスト/加法式/PLUS
02_keisan-4: program/全体/関数定義/複合文/式文/後置式/引数リスト/加法式/number
02_keisan-5: program/全体/関数定義/複合文/式文/後置式/引数リスト/文字列
~~~

02_keisan-* は，新しく学習したプログラムの構文について，その階層を示しています．
例えば，
- 02_keisan-1 は，printfの後ろに複数の引数（引数リスト）をとっている構文が初めて出現したことを表します
- 02_keisan-2 は，引数の中に加法式が初めて出現したことを，3,4はそれぞれ＋記号と数値が出現したことを表します．
- 02_keisan-5 は，引数リストの中に文字列が出現したことを表します（１つ前のプログラムでも文字列は使っていますが，単独の引数であったため「引数リスト」とは見なされていませんでした）



