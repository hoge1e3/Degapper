int main(void) {
  int input;
  printf ("���ݎ���(0-23)? ");
  scanf ("%d", &input);
  if (input<6 || input>=18) {
     printf("����΂��\n");
  }
  if (input>=6 && input<12) {
     printf("���͂悤\n");
  }
  if (input>=12 && input<18) {
     printf("����ɂ���\n");
  }
}
