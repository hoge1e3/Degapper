#include<stdio.h>
int main(void) {
   char name[10]="YAMADA";
   printf ("You name is %s.\n",name);

   int i;
   for (i=0 ; i<10 ; i++) {
       printf ("name[%d]= %d\n", i,name[i]);
   }
}

