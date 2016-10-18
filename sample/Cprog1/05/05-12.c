#include"x.h"
void move(int i);
int main(void);
float x[2],y[2],vx[2],vy[2];

int main(void) {
  setColor(255,0,0);
  x[0]=0; y[0]=50; vx[0]=2; vy[0]=1;
  x[1]=100; y[1]=120; vx[1]=2; vy[1]=1;
  while (1) {
     clear();
     move(0);
     move(1);
     update();
  }
  wait();
}
void move(int i) {
     fillRect(x[i],y[i] , 50, 50);
     x[i]=x[i]+vx[i];
     y[i]=y[i]+vy[i];
}

