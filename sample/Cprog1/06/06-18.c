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

Sikaku newSikaku(float x, float y,float vx, float vy) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   return s;
}

// move, draw ŠÖ”‚Íæ‚Ù‚Ç‚Æ“¯‚¶
int main (void) {
  Sikaku s[2];
    int i;

  s[0]=newSikaku(200,100,2,1);
  s[1]=newSikaku(50,150,2,1);
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

