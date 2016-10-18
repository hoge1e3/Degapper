#include<stdio.h>
int sankaku_menseki(int teihen, int takasa);

int main (void) {
    int m;
    m = sankaku_menseki(20, 10);
    printf("面積 %d \n", m);
    return 0;
}
int sankaku_menseki(int teihen, int takasa) {
    int menseki;
    menseki = teihen*takasa/2;
    return menseki;
}
