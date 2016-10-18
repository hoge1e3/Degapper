#include"x.h"
int main(void) {
   int x;
   setColor(255,0,0); 
   x=100;
   fillRect(x,30,10,50);
   x=x+20;
   fillRect(x,30,10,50);
   x=x+20;
   fillRect(x,30,10,50);
   wait();
} 
