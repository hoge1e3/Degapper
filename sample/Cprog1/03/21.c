int main(void){
  int answer, input, k=0;
  srand(time(NULL));
  answer = rand() % 100;
  while(1) {
  printf ("�������(0-99):");
  scanf ("%d", &input);
  if (input==answer){
    printf("������\n");
    k++;
    break;
  } else if (input<=answer){
      printf("������\n");
      k++;
  } else if (input>=answer){
    printf("�傫��\n");
    k++;
  }
  }
  printf("%d�񂩂���܂���\n",k);
}