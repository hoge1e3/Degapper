#include "x.h"
#define ENEMYCOUNT 10

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 
void writeRank(int rank[]);
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
void goRight(Sikaku *e) {
  if ((*e).x<0) {
    (*e).x=400;
  }
}
void moveEnemies(Sikaku enemy[], Sikaku *player) {
  int i;
  for (i=0 ; i<10 ; i++) {
    draw(&enemy[i]);
    move(&enemy[i]);
    goRight(&enemy[i]);
    if (crash(   player  , &enemy[i])==1) {
      (*player).y=-1000;
    }
  }
}

void movePlayer(Sikaku *player) {
  draw(player);
  move(player);
  if (getkey("Down")>0) {   (*player).vy=1;     }
  else if (getkey("Up")>0) {  (*player).vy=-1;     }
  else {   (*player).vy=0;  }
}
void moveBullets(Sikaku bullet[], Sikaku enemy[], int *score)  {
  int i;
  for (i=0 ; i<3 ; i++) {
    draw(&bullet[i]);
    move(&bullet[i]);
    int j;
    for (j=0; j<10 ; j++) {
      if (crash(&bullet[i], &enemy[j])==1) {
	enemy[j].x=-100;
	bullet[i].x=1000;
	(*score)++;
      }
    }
  }
}
void fireBullet(Sikaku bullet[], Sikaku *player)  {
  if (getkey("space")==1) {
    int i=selectBullet(bullet);
    if (i>=0) {
      bullet[i].x=(*player).x;
      bullet[i].y=(*player).y;   
    } 
  }

}
void readRank(int rank[]){
  // ここにプログラムを書く
  int i;
  FILE *fp;
  fp=fopen("rank.txt", "r");
  i=0;
  while (1) {
     int r=fscanf(fp, "%d",&rank[i]);
     if (r==EOF) break;
     i++;
  }
  fclose(fp);
}


void writeRank(int rank[]) {
  int i;
  // ここにプログラムを書く
  FILE* fp;
  fp=fopen("rank.txt", "w");
  for (i=0 ; i<5 ; i++) {
     fprintf(fp, "%d\n", rank[i]);
  }
}
void sortRank(int rank[]) {
  int i,j;
  for (j=0 ; j<5 ;  j++) {
    for (i=0 ; i<4 ;  i++) {
      if (rank[i]<rank[i+1]) {
	int c=rank[i];
	rank[i]=rank[i+1];
	rank[i+1]=c;
      }
    }
  }
}


int main (void) {
  Sikaku player;  Sikaku enemy[10];
  Sikaku bullet[3];
  int rank[5];
  readRank(rank);
  while(1) {
    int score=0;
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
      drawNumber(score,200,50);
      movePlayer(&player);
      moveEnemies(enemy, &player);
      moveBullets(bullet,enemy, &score);
      fireBullet(bullet, &player);
      if (player.y<0) {
	break;
      }
      update();
    }
    //ゲームオーバー
    if (score>rank[4]) {
      rank[4]=score;
      sortRank(rank);
      writeRank(rank);
    }
    // ランキングの表示
    printf("--Ranking--\n");
    for (i=0 ; i<5 ;i++) {
      printf("No. %d: Score %d\n",i+1, rank[i]);
    }

  }
}
