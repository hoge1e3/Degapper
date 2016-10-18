#include"x.h"
int main(void) {
   setColor(255,0,0);
   fillRect(30,30, 100, 100);
   setColor(0,255,128);
   fillRect(30,200, 100, 10);
   fillRect(30,230, 100, 10);
   setColor(128,0,255);
   fillRect(200,30, 10, 100);
   wait();
}
