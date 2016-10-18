#include"x.h"
int main(void) {
   int x,y,i;
   setColor(255,0,0); 
   x=100;y=20;
   for (i=0; i<10 ; i++) {
     fillRect(x, y, 10, 50);
     x=x+20;
     y=y+10;
   } 
   wait();
} 
