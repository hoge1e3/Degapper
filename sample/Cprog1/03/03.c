#include<stdio.h>
int main(void) {
  int input;
  printf ("���ݎ���(0-23)? ");
  scanf ("%d", &input);
  if (input<12) {
     printf("���͂悤\n");
  } else {
     printf("����ɂ���\n");
  }
}
