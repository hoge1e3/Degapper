int main(void) {
   int answer, input;
   srand( time(NULL));
   answer = rand() % 2;
   while (1) {
     printf ("�\(0)  ��(1) �ǂ���? ");
     scanf ("%d", &input);
     if (input==answer) {
        printf("������\n");
        break;
     } else {
        printf("�͂���\n");
     }
   }
}
