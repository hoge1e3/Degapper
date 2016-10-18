#include<stdio.h>
int main(void) {
  int input;
  printf ("Œ»İ(0-23)? ");
  scanf ("%d", &input);
  if (input<12) {
     printf("‚¨‚Í‚æ‚¤\n");
  } else {
     printf("‚±‚ñ‚É‚¿‚Í\n");
  }
}
