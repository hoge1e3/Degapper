#include<stdio.h>
int main(void) {
   int a,b;
   printf("a=");
   scanf("%d", &a);
   printf("b=");
   scanf("%d", &b);
   printf("%d たす %d は %d ", a,b,a+b);
   printf("%d ひく %d は %d ", a,b,a-b);
   printf("%d かける %d は %d ", a,b,a*b);
   printf("%d わる %d は %d ", a,b,a/b);
}

