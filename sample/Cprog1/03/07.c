#include<stdio.h>
#include<stdio.h>
#include<time.h>
int main(void) {
  int answer;
  srand( time(NULL));
  answer = rand() % 2;
  printf ("%d\n",answer);
} 
