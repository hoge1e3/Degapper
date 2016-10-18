#include<stdio.h>
typedef struct {
  int score;
  char name[10];
} Rank;


void readRank(Rank rank[]);
void writeRank(Rank rank[]) {
  FILE *fp;
  // ここにプログラムを書く
  int i;
  fp=fopen ("rank.txt","w");
  for (i=0 ; i<5; i++) {
      fprintf(fp,"%d %s\n", rank[i].score, rank[i].name);
  }
  fclose (fp);
}


void readRank(Rank rank[]){
  // ここにプログラムを書く
   int i;
   FILE *fp;
   // 読み込み
   fp=fopen ("rank.txt","r");
   i=0;
   while (1) {
      int r=fscanf(fp, "%d %9s", &rank[i].score, rank[i].name);
      if (r==EOF) break;
      i++;
   }
   fclose(fp);
}
    void sortRank(Rank rank[]) {
       int i,j;
       for (j=0 ; j<5 ;  j++) {
          for (i=0 ; i<4 ;  i++) {
             if (rank[i].score<rank[i+1].score) {
                Rank c=rank[i];
                rank[i]=rank[i+1];
                rank[i+1]=c;
             }
          }
       }
    }


int main () {
   Rank rank[5];
   readRank(rank);
   sortRank(rank);
   writeRank(rank);
}

/*
int main(void) {
   
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
*/
