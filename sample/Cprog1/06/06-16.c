#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

Sikaku move(Sikaku s) { // lŠpŒ`‚ğ“®‚©‚·(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   return s;
}


void draw(Sikaku s) { // lŠpŒ`‚ğ•`‚­(draw)
   fillRect(s.x,s.y, 20, 20);
}

// move, draw ŠÖ”‚Íæ‚Ù‚Ç‚Æ“¯‚¶
int main (void) {
  Sikaku s[2];
  int i;
  s[0].x=200; s[0].y=100; s[0].vx=2; s[0].vy=1;
  s[1].x=50;  s[1].y=150; s[1].vx=2; s[1].vy=1;
  setColor(255,0,0);
  while (1) {
    clear();
    for (i=0 ; i<2; i++) {
      draw(s[i]);
      s[i]=move(s[i]);
    }

    update();
  }
}

