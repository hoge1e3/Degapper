int main(void) {
  int input;
  printf ("Œ»İ(0-23)? ");
  scanf ("%d", &input);
  if (input<6 || input>=18) {
     printf("‚±‚ñ‚Î‚ñ‚Í\n");
  }
  if (input>=6 && input<12) {
     printf("‚¨‚Í‚æ‚¤\n");
  }
  if (input>=12 && input<18) {
     printf("‚±‚ñ‚É‚¿‚Í\n");
  }
}
