int main(void) {
  int answer, input;
  srand( time(NULL));
  answer = rand() % 2;
  printf ("%d\n", answer);
  printf ("�\(0)  ��(1) �ǂ���? ");
  scanf ("%d", &input);
  if (input==answer) {
     printf("������\n");
  } else {
     printf("�͂���\n");
  }
}
