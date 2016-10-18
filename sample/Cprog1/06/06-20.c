#include "x.h"

typedef struct {
  float x, y;
  float vx, vy;
} Sikaku; 

Sikaku move(Sikaku s) { // �l�p�`�𓮂���(move)
   s.x=s.x+s.vx;
   s.y=s.y+s.vy;
   return s;
}


void draw(Sikaku s) { // �l�p�`��`��(draw)
   fillRect(s.x,s.y, 20, 20);
}

Sikaku newSikaku(float x, float y,float vx, float vy) {
   Sikaku s;
   s.x=x; s.y=y;
   s.vx=vx; s.vy=vy;
   return s;
}

// move, draw �֐��͐�قǂƓ���
int main (void) {
  Sikaku s[10];
    int i=0;

  for (i=0 ; i<10 ; i++) {
     s[i]=newSikaku(rand()%200,rand()%200,rand()%11-5,rand()%11-5);
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

