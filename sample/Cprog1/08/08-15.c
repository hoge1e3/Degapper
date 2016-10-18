#include "x.h"
#define ENEMYCOUNT 10

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 
void draw(Sikaku *s) { // 四角形を描く(draw)
   fillRect((*s).x,(*s).y, 20, 20);
}
void move(Sikaku *s) { // 四角形を動かす(move)
   (*s).x=(*s).x+(*s).vx;
   (*s).y=(*s).y+(*s).vy;
}
Sikaku newSikaku(float x,float y,float vx, float vy) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   return s;
}
int crash(Sikaku *p, Sikaku *e) {
 if ((*e).x>=(*p).x-20 && (*e).x<=(*p).x+20 && 
     (*e).y>=(*p).y-20 && (*e).y<=(*p).y+20) {
      return 1;
   } else {
      return 0;
   }
}
int selectBullet(Sikaku b[]) {
   int i;
   for (i=0 ; i<3 ; i++) {
      if (b[i].x>500) {
        return i;
      }
   }
   return -1;
}

int main (void) {
  Sikaku player;  Sikaku enemy[10];
  Sikaku bullet[3];
  player=newSikaku(10,10,0,0);  
  int i;
  srand(time(NULL));
  for (i=0 ;i<10 ; i++) {
     enemy[i]=newSikaku(rand()%200+100, rand()%200, -1,0);
  }
  for (i=0 ;i<3 ; i++) {
     bullet[i]=newSikaku(rand()%200, rand()%200, 2,0);
  }
  setColor(255,0,0);
  while(1) {
    clear();
    draw(&player);
    move(&player);
    if (getkey("Down")>0) {   player.vy=1;     }
    else {   player.vy=0;  }
    for (i=0 ; i<10 ; i++) {
        draw(&enemy[i]);
        move(&enemy[i]);
        if (crash(&player, &enemy[i])==1) {
            printf("Game Over\n");
            exit(0);
        }
    }
    for (i=0 ; i<3 ; i++) {
       draw(&bullet[i]);
       move(&bullet[i]);
    }
    if (getkey("space")==1) {
          bullet[0].x=player.x;
          bullet[0].y=player.y;   
    }
    update();
  }
}
