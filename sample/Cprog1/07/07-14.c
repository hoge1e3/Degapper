#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

Sikaku newSikaku(float x,float y,float vx, float vy) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   return s;
}

void move(Sikaku *s) { // 四角形を動かす(move)
   (*s).x=(*s).x+(*s).vx;
   (*s).y=(*s).y+(*s).vy;
}


void draw(Sikaku s) { // 四角形を描く(draw)
   fillRect(s.x,s.y, 20, 20);
}

int main (void) {
  Sikaku player; // プレイヤーを表すSikaku
  player=newSikaku(10,10,0,1);  
  setColor(255,0,0);
  while(1) {
    clear();
    draw(player);
    move(&player);
    if (getkey("Down")>0) {
       player.vy=1;
    } else {
       player.vy=0;
    }
    update();
  }
}



