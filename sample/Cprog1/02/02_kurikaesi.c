#include<stdio.h>
int main(void) {
   int x;
   x=1;
   while(x<=10) {     
       printf("%d * %d = %d\n", x, x, x*x);
       x=x+1;
   }
}
