int main(void) {
   int answer, input;
   srand( time(NULL));
   answer = rand() % 2;
   while (1) {
     printf ("表(0)  裏(1) どっち? ");
     scanf ("%d", &input);
     if (input==answer) {
        printf("当たり\n");
        break;
     } else {
        printf("はずれ\n");
     }
   }
}
