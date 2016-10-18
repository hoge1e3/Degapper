#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

void draw(Sikaku s) { 
   fillRect(s.x,s.y, 20, 20);
}

int main (void) {
  Sikaku s;
  s.x=10; s.y=20; s.vx=2; s.vy=1;
  setColor(255,0,0);
  while (1) {
    clear();
    fillRect(s.x,s.y, 20, 20);
    s.x=s.x+s.vx;
    s.y=s.y+s.vy;
    update();
  }
}

