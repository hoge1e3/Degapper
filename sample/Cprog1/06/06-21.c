#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
  int r,g,b;
} Sikaku; 

Sikaku move(Sikaku s) { // lŠpŒ`‚ğ“®‚©‚·(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   return s;
}


void draw(Sikaku s) { // lŠpŒ`‚ğ•`‚­(draw)
   setColor(s.r, s.g, s.b);
   fillRect(s.x,s.y, 20, 20);
}

Sikaku newSikaku(float x, float y,float vx, float vy, int r, int g , int b) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   s.r=r;s.g=g;s.b=b;
   return s;
}

// move, draw ŠÖ”‚Íæ‚Ù‚Ç‚Æ“¯‚¶
int main (void) {
  Sikaku s[10];
  int i=0;
     s[i++]=newSikaku(0,0,1,0, 255,0,0);
     s[i++]=newSikaku(200,0,-1,1, 0,255,0);
     s[i++]=newSikaku(0,200,0,-1, 0,0,255);
  setColor(255,0,0);
  while (1) {
    clear();
    for (i=0 ; i<3; i++) {
      draw(s[i]);
      s[i]=move(s[i]);
    }

    update();
  }
}

