int main(void) {
  int answer, input;
  srand( time(NULL));
  answer = rand() % 2;
  printf ("%d\n", answer);
  printf ("表(0)  裏(1) どっち? ");
  scanf ("%d", &input);
  if (input==answer) {
     printf("当たり\n");
  } else {
     printf("はずれ\n");
  }
}
