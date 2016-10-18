#include"x.h"
int main(void) {
   int x;
   x=100;
   setColor(0,255,0); 
   fillRect(x, 30, 50, 50);
   x=x+100;
   fillRect(x, 30, 50, 50);
   wait();
} 
