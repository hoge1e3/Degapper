#include<stdio.h>
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
void showRank(int rank[]) {
  int i;
  //表示（確認用)
  for (i=0 ; i<5; i++) {
     printf("No %d.  score=%d\n", i, rank[i]);
  }
}
int main () {
   int rank[5];
   readRank(rank);
   showRank(rank);
}


