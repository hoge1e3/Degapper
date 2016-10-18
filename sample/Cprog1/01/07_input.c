#include<stdio.h>
int main(void) {
   int day;
   printf("今日は何日： ");
   scanf("%d", &day);
   printf("今日は %d日です\n", day);
　 day=day+1;
   printf("明日は %d日です\n", day);
}
