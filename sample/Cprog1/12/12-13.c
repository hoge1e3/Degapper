#include<stdio.h>
typedef struct {
  int score;
  char name[10];
} Rank;

int main(void) {
   int i;
   Rank rank[5];
   FILE *fp;
   fp=fopen ("rank.txt","r");
   i=0;
   while (1) {
      int r=fscanf(fp, "%d %9s", &rank[i].score, rank[i].name);
      if (r==EOF) break;
      i++;
   }
   //表示（確認用）
   for (i=0 ; i<5 ; i++ ){
      printf("No %d. score=%d  name=%s\n", i, rank[i].score, rank[i].name); 
   }
}

