int main(void) {
   int answer, input;
   srand( time(NULL));
   answer = rand() % 2;
   while (1) {
     printf ("•\(0)  — (1) ‚Ç‚Á‚¿? ");
     scanf ("%d", &input);
     if (input==answer) {
        printf("“–‚½‚è\n");
        break;
     } else {
        printf("‚Í‚¸‚ê\n");
     }
   }
}
