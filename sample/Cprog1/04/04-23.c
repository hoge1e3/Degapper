#include<stdio.h>
int seihoukei_menseki(int teihen);
int main(void);

int main (void) {
    int m;
    int n;
    scanf("%d", &n);
    m = seihoukei_menseki(n);
    printf("面積 %d \n", m);
    return 0;
}
int seihoukei_menseki(int teihen) {
    int menseki;
    menseki = teihen*teihen;
    return menseki;
}
