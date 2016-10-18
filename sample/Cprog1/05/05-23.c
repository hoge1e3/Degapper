#include"x.h"

float x[2],y[2],vx[2],vy[2];

void sankaku(int x,int y) {
   setPen(x,y);
   movePen(100, 100);
   movePen(-200, 0);
   movePen(100, -100);
}
void move(int i) {
     sankaku(x[i],y[i]);
     x[i]=x[i]+vx[i];
     y[i]=y[i]+vy[i];
     if (x[i]>=200) {
       vx[i]=-2;
     }
     if (x[i]<=0) {
       vx[i]=2;
     }
     if (y[i]>=200) {
       vy[i]=-2;
     }
     if (y[i]<=0) {
       vy[i]=2;
     }

}
void setup(int i) {
     x[i]=rand() % 200;  y[i]=rand() % 200;  
     vx[i]=2; vy[i]=1; 
}
void setupAll() {
  int i;
  for (i=0 ; i<2; i++) setup(i);

}
void moveAll() {
    int i;
     for (i=0; i<2; i++) {
       move(i);
     }
}
int main(void) {
  int i;
  setColor(255,0,0);
  srand(time(NULL));
  setupAll();
  while (1) {
     clear();
     moveAll();
     update();
  }
  wait();
}


