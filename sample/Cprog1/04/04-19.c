#include"x.h"
void seihoukei(int x, int y, float zoom);
int main(void);

int main (void) {
    drawGrid();
    seihoukei(100,100,1);
    wait();
    return 0;
}
void seihoukei(int x, int y, float zoom) {
   setPen(x,y);
   movePen(zoom*100,0);
   movePen(0,zoom*100);
   movePen(-zoom*100,0);
   movePen(0,-zoom*100);
}
