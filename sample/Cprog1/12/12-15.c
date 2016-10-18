#include<stdio.h>
typedef struct {
  int score;
  char name[10];
} Rank;

int main(void) {
   int i;
   Rank rank[5];
   FILE *fp;
   // “Ç‚İ‚İ
   fp=fopen ("rank.txt","r");
   i=0;
   while (1) {
      int r=fscanf(fp, "%d %9s", &rank[i].score, rank[i].name);
      if (r==EOF) break;
      i++;
   }
   // –¼‘O‚Ì“o˜^
   printf("Input your name:");
   scanf("%9s", rank[4].name);
   rank[4].score=100;
   // ‘‚«‚İ
   fp=fopen ("rank.txt","w");
   for (i=0 ; i<5; i++) {
      fprintf(fp,"%d %s\n", rank[i].score, rank[i].name);
   }
   fclose (fp);
}

