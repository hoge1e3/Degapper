int main(void){
  int answer, input, k=0;
  srand(time(NULL));
  answer = rand() % 100;
  while(1) {
  printf ("数を入力(0-99):");
  scanf ("%d", &input);
  if (input==answer){
    printf("当たり\n");
    k++;
    break;
  } else if (input<=answer){
      printf("小さい\n");
      k++;
  } else if (input>=answer){
    printf("大きい\n");
    k++;
  }
  }
  printf("%d回かかりました\n",k);
}