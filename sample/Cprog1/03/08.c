int main(void) {
  int answer, input;
  srand( time(NULL));
  answer = rand() % 2;
  printf ("%d\n", answer);
  printf ("•\(0)  — (1) ‚Ç‚Á‚¿? ");
  scanf ("%d", &input);
  if (input==answer) {
     printf("“–‚½‚è\n");
  } else {
     printf("‚Í‚¸‚ê\n");
  }
}
