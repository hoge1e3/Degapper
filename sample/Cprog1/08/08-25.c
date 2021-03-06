#include "x.h"
#define ENEMYCOUNT 20
#define BULLETCOUNT 5

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
   for (i=0 ; i<BULLETCOUNT ; i++) {
      if (b[i].x>500) {
        return i;
      }
   }
   return -1;
}
void goRight(Sikaku *s) {
  if ((*s).x<0) {
   (*s).x=400;
   (*s).y=rand()%200;
   (*s).vx=-rand()%3-1;
   (*s).vy=rand()%3-1;
  }
}
int crashToOthers(Sikaku s[],int c,int i) {
   int k;
   for (k=0 ; k<c ; k++) {
       if (k!=i) {
          if (crash(&s[i], &s[k])==1) return 1;
       
       }
   }
   return 0;
}


int main (void) {
  Sikaku player;  Sikaku enemy[ENEMYCOUNT];
  Sikaku bullet[BULLETCOUNT];
  player=newSikaku(10,10,0,0);  
  int i;
  srand(time(NULL));
  for (i=0 ;i<ENEMYCOUNT ; i++) {
     enemy[i]=newSikaku(rand()%200+100, rand()%200, -1,0);
  }
  for (i=0 ;i<BULLETCOUNT ; i++) {
     bullet[i]=newSikaku(rand()%200, rand()%200, 2,0);
  }
  setColor(255,0,0);
  while(1) {
    clear();
    draw(&player);
    move(&player);
    if (getkey("Down")>0) {   player.vy=1;     }
    else {   player.vy=0;  }
    for (i=0 ; i<ENEMYCOUNT ; i++) {
        draw(&enemy[i]);
        move(&enemy[i]);
        if (crashToOthers(enemy,ENEMYCOUNT,i)==1) {
           enemy[i].vx=rand()%5-2;
           enemy[i].vy=rand()%5-2;
        }
        goRight(&enemy[i]);
        if (crash(&player, &enemy[i])==1) {
            printf("Game Over\n");
            exit(0);
        }
    }
    for (i=0 ; i<BULLETCOUNT ; i++) {
       draw(&bullet[i]);
       move(&bullet[i]);
        int j;
        for (j=0; j<ENEMYCOUNT ; j++) {
           if (crash(&bullet[i], &enemy[j])==1) {
              enemy[j].x=-100;
              bullet[i].x=1000;
           }
        }
    }
    if (getkey("space")==1) {
       i=selectBullet(bullet);
       if (i>=0) {
          bullet[i].x=player.x;
          bullet[i].y=player.y;   
       } 
    }
    update();
  }
}
