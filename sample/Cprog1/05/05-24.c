#include"x.h"

float x[2],y[2],vx[2],vy[2],h[2];

void move(int i) {
     fillRect(x[i],y[i]-h[i]/2 , 10, h[i]);
     x[i]=x[i]+vx[i];
     y[i]=y[i]+vy[i];
     h[i]++;

}
void setup(int i) {
     x[i]=rand() % 200;  y[i]=rand() % 200;  
     vx[i]=2; vy[i]=0; 
}
void setupAll() {
  int i;
  for (i=0 ; i<2; i++) setup(i);

}
void moveAll() {
   int i;  for (i=0; i<2; i++) {
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


