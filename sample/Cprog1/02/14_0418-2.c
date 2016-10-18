#include<stdio.h>
int main(void) {
   int sum=1,i,n;
   scanf("%d",&n);
   for (i=1 ; i<=n ; i++) {
       sum=sum*i;
   }
   printf ("1から%dまでのseki＝%d\n",n,sum);
}
