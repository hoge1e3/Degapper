#include<stdio.h>
int main(void) {
   int sum=0,i,n;
   scanf("%d",&n);
   for (i=1 ; i<=n ; i++) {
       sum=sum+i;
   }
   printf ("1から%dまでの和＝%d\n",n,sum);
}
