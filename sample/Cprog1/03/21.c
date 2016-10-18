int main(void){
  int answer, input, k=0;
  srand(time(NULL));
  answer = rand() % 100;
  while(1) {
  printf ("”‚ğ“ü—Í(0-99):");
  scanf ("%d", &input);
  if (input==answer){
    printf("“–‚½‚è\n");
    k++;
    break;
  } else if (input<=answer){
      printf("¬‚³‚¢\n");
      k++;
  } else if (input>=answer){
    printf("‘å‚«‚¢\n");
    k++;
  }
  }
  printf("%d‰ñ‚©‚©‚è‚Ü‚µ‚½\n",k);
}