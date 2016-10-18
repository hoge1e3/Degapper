#include "x.h"

typedef struct {
   int r,g,b;
} Color; 

typedef struct {
  float x, y;
  float vx, vy;
  Color c;
} Sikaku; 

Sikaku move(Sikaku s) { // ŽlŠpŒ`‚ð“®‚©‚·(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   if (s.x>200 || s.x<0) s.vx=-s.vx;
   if (s.y>200 || s.y<0) s.vy=-s.vy;
   return s;
}


void draw(Sikaku s) { // ŽlŠpŒ`‚ð•`‚­(draw)
   setColor(s.c.r, s.c.g, s.c.b);
   fillRect(s.x,s.y, 20, 20);
}

Sikaku newSikaku(float x, float y,float vx, float vy, Color c) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   s.c=c;
   return s;
}

Color newColor(int r,int g,int b){
   Color c;
   c.r=r;c.g=g;c.b=b;
   return c;
}

// move, draw ŠÖ”‚Íæ‚Ù‚Ç‚Æ“¯‚¶
int main (void) {
  Sikaku s[10];
  int i=0;
  for (i=0 ; i<10 ; i++) {
     s[i]=newSikaku(rand()%200,rand()%200,1,2, newColor( rand()%255, rand()%255, rand()%255));
  }
    setColor(255,0,0);
  while (1) {
    clear();
    for (i=0 ; i<10; i++) {
      draw(s[i]);
      s[i]=move(s[i]);
    }

    update();
  }
}

