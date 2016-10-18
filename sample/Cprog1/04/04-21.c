#include"x.h"
void seihoukei(int x, int y, float zoom);
void sankaku(int x,int y);
void house(int x, int y);
int main(void);

int main (void) {
    drawGrid();
    house(100,100);
    house(300,0);
    house(400,160);
    wait();
    return 0;
}
void house(int x, int y) {
    sankaku(x,y);
    seihoukei(x-50,y+100,1);
}
void seihoukei(int x, int y, float zoom) {
   setPen(x,y);
   movePen(zoom*100,0);
   movePen(0,zoom*100);
   movePen(-zoom*100,0);
   movePen(0,-zoom*100);
}
void sankaku(int x,int y) {
   setPen(x,y);
   movePen(100, 100);
   movePen(-200, 0);
   movePen(100, -100);
}

