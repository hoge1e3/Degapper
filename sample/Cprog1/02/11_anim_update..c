#include"x.h"
int main () {
  int x,y;
  setColor(255,0,0);
  x=30; y=50; 
  while (x<300) {
     fillRect(x,y , 50, 50);
     x=x+1;
     update();
  }
  wait();
}
