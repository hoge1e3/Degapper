#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

void draw(Sikaku s) { // 四角形を描く(draw)
   fillRect(s.x,s.y, 20, 20);
}

int main (void) {
  Sikaku s;
  s.x=10; s.y=20; s.vx=2; s.vy=1;
  setColor(255,0,0);
  while (1) {
    clear();
    draw(s);
    s.x=s.x+s.vx;
    s.y=s.y+s.vy;
    update();
  }
}

