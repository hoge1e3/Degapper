#include<stdio.h>
int main(void) {
  int input;
  printf ("現在時刻(0-23)? ");
  scanf ("%d", &input);
  if (input<12) {
     printf("おはよう\n");
  } else {
     printf("こんにちは\n");
  }
}
