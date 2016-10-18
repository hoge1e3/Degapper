#include"x.h"
void sankaku(int x, int y, float zoom);
int main (void) {
     setColor(0,0,0);
     sankaku(200, 100, 0.5);
     sankaku(300, 200, 1.5);
     wait();
}
void sankaku(int x, int y, float zoom) {
   setPen(x, y);
   movePen(100*zoom , 100*zoom);
   movePen(-200*zoom, 0);
   movePen(100*zoom, -100*zoom);
}
