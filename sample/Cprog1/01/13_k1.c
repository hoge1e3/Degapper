#include<stdio.h>
int main(void) {
   int day,mon;
   printf("今日は何月： ");
   scanf("%d", &mon);
   printf("今日は何日： ");
   scanf("%d", &day);
   printf("今日は %d月%d日です\n", mon, day);
　 day=day+1;
   printf("明日は %d月%d日です\n", mon, day);
　 day=day-1;
　 mon=mon+1;
   printf("一ヶ月後は %d月%d日です\n", mon, day);
}
