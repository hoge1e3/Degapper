#include"x.h"
int main(void) {
  int x, i;
  setColor(255,0,0);
  x=10;
  for(i=0; i<8; i++){
    if(i>3 && i<7){
      fillOval(x, 20, 30 ,30); 
    } else {
      fillRect(x, 20, 30 ,30); 
    }
    x=x+40;
  }
  wait();
}

