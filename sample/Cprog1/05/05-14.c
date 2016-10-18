#include"x.h"
void move(int i);
int main(void);
float x[2],y[2],vx[2],vy[2];

int main(void) {
  int i;
  srand(time(NULL));
  setColor(255,0,0);
  x[0]=rand()%200; y[0]=rand()%200; vx[0]=2; vy[0]=1;
  x[1]=rand()%200; y[1]=rand()%200; vx[1]=2; vy[1]=1;
  while (1) {
     clear();
     for (i=0 ; i<2 ; i++) {
        move(i);
     }
     update();
  }
  wait();
}
void move(int i) {
     fillRect(x[i],y[i] , 50, 50);
     x[i]=x[i]+vx[i];
     y[i]=y[i]+vy[i];
}

