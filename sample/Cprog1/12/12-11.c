#include<stdio.h>
typedef struct {
  int score;
  char name[20];
} Rank;

int main(void) {
   int i;
   Rank rank[5]={ {20,"aaa"}, {10,"bbb"}, {8,"ccc"}, {5,"ddd"}, {2,"eee"} };
   FILE *fp;
   fp=fopen ("rank.txt","w");
   for (i=0 ; i<5; i++) {
      fprintf(fp,"%d %s\n", rank[i].score, rank[i].name);
   }
   fclose (fp);
}

