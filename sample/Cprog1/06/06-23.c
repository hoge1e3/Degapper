#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
  int r,g,b;
} Sikaku; 

Sikaku move(Sikaku s) { // 四角形を動かす(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   if (s.x>200 || s.x<0) s.vx=-s.vx;
   if (s.y>200 || s.y<0) s.vy=-s.vy;
   return s;
}


void draw(Sikaku s) { // 四角形を描く(draw)
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

// move, draw 関数は先ほどと同じ
int main (void) {
  Sikaku s[10];
  int i=0;
  for (i=0 ; i<10 ; i++) {
     s[i]=newSikaku(rand()%200,rand()%200,1,2, rand()%255, rand()%255, rand()%255);
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

