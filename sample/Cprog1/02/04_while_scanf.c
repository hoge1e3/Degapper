#include<stdio.h>
int main(void) {
   int x,n;
   printf("�J��Ԃ���? ");
   scanf("%d",&n);
   x=1;
   while(x<=n) {     
       printf("%d * %d = %d\n", x, x, x*x);
       x=x+1;
   }
}
