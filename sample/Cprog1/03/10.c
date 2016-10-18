#include"x.h"
int main(void) {
   int x,i;
   setColor(255,0,0); 
   x=100;
   for (i=0; i<10 ; i++) {
     fillRect(x, 30, 10, 50);
     x=x+20;
   } 
   wait();
} 
