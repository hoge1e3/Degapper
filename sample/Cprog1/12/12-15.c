#include<stdio.h>
typedef struct {
  int score;
  char name[10];
} Rank;

int main(void) {
   int i;
   Rank rank[5];
   FILE *fp;
   // 読み込み
   fp=fopen ("rank.txt","r");
   i=0;
   while (1) {
      int r=fscanf(fp, "%d %9s", &rank[i].score, rank[i].name);
      if (r==EOF) break;
      i++;
   }
   // 名前の登録
   printf("Input your name:");
   scanf("%9s", rank[4].name);
   rank[4].score=100;
   // 書き込み
   fp=fopen ("rank.txt","w");
   for (i=0 ; i<5; i++) {
      fprintf(fp,"%d %s\n", rank[i].score, rank[i].name);
   }
   fclose (fp);
}

