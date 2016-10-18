#include"x.h"
int main(void) {
  float x,y,vx,vy;
  setColor(255,0,0);
  x=0; y=50; vx=2; vy=1;
  while (1) {
     clear();
     fillRect(x,y , 50, 50);
     x=x+vx;
     y=y+vy;
     update();
  }
  wait();
}

