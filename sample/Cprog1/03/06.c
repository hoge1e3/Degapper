int main(void) {
  int input;
  printf ("現在時刻(0-23)? ");
  scanf ("%d", &input);
  if (input<6 || input>=18) {
     printf("こんばんは\n");
  }
  if (input>=6 && input<12) {
     printf("おはよう\n");
  }
  if (input>=12 && input<18) {
     printf("こんにちは\n");
  }
}
