#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

Sikaku move(Sikaku s) { // 四角形を動かす(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   return s;
}


void draw(Sikaku s) { // 四角形を描く(draw)
   fillRect(s.x,s.y, 20, 20);
}

Sikaku newSikaku(float x, float y,float vx, float vy) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   return s;
}

// move, draw 関数は先ほどと同じ
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

