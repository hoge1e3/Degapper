#include<stdio.h>

int main(void) {
   int a[10];
   int i;
   for (i=0 ; i<10 ; i++) a[i]=0;
   while(1) {
      int v;
      scanf("%d",&v);
      if (v<0 || v>9) break;
      a[v]++;
   }
   for (i=0 ; i<10 ; i++) {
      printf ("%d は %d 回入力されました\n", i, a[i]);
   }
}

