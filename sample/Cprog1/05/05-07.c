#include"x.h"
void move();
void move2();
int main(void);
float x,y,vx,vy;
float x2,y2,vx2,vy2;

int main(void) {
  setColor(255,0,0);
  x=0; y=50; vx=2; vy=1;
  x2=100; y2=120; vx2=2; vy2=1;
  while (1) {
     clear();
     move();
     move2();
     update();
  }
  wait();
}
void move() {
     fillRect(x,y , 50, 50);
     x=x+vx;
     y=y+vy;
}

void move2() {
     fillRect(x2,y2 , 50, 50);
     x2=x2+vx2;
     y2=y2+vy2;
}

