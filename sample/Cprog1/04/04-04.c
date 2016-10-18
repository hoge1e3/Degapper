#include"x.h"
int main (void) {
  setColor(0,0,0);
  setPen(200, 100);
  movePen(100, 100);
  movePen(-200, 0);
  movePen(100, -100);
  setPen(300, 200);
  movePen(100, 100);
  movePen(-200, 0);
  movePen(100, -100);
  wait();
}
