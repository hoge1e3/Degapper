#include"x.h"
void move(int i);
int main(void);
void setup(int i);
float x[2],y[2],vx[2],vy[2];

int main(void) {
  int i;
  setColor(255,0,0);
  srand(time(NULL));
  for (i=0 ; i<2; i++) {
     setup(i);
  }
  while (1) {
     clear();
     for (i=0 ; i<2 ; i++) {
        move(i);
     }
     update();
  }
  wait();
}
void setup(int i) {
     x[i]=rand()%200; y[i]=rand()%200; vx[i]=2; vy[i]=1;
}
void move(int i) {
     fillRect(x[i],y[i] , 50, 50);
     x[i]=x[i]+vx[i];
     y[i]=y[i]+vy[i];
     if (x[i]>=200) {
       vx[i]=-2;
     }
     if (x[i]<=0) {
       vx[i]=2;
     }
     if (y[i]>=200) {
       vy[i]=-1;
     }
     if (y[i]<=0) {
       vy[i]=1;
     }

}

