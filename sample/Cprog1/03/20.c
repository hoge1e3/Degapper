#include"x.h"
int main(void){
  int x, y,vx,vy;
  setColor(255,0,0);
  x=30; y=20;
  vx=2; vy=1;
  while (x<300){
    clear();
    fillRect(x,y,50,50);
    x=x+vx; y=y+vy;
    if (x>=250){
      vx=-2;
    } 
    if(x<60){
      vx=2;
    }
    update();
  }
    wait();
}
