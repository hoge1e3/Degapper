#include<stdio.h>
typedef struct {
  int score;
  char name[10];
} Rank;

void readRank(Rank rank[]){
  // �����Ƀv���O����������
   int i;
   FILE *fp;
   // �ǂݍ���
   fp=fopen ("rank.txt","r");
   i=0;
   while (1) {
      int r=fscanf(fp, "%d %9s", &rank[i].score, rank[i].name);
      if (r==EOF) break;
      i++;
   }
   fclose(fp);
}
void showRank(Rank rank[]) {
   int i;
 // �����Ƀv���O����������
   for (i=0 ; i<5 ; i++ ){
      printf("No %d. score=%d  name=%s\n", 
                 i, rank[i].score, rank[i].name); 
   }
}
int main () {
   Rank rank[5];
   readRank(rank);
   showRank(rank);
}

/*
int main(void) {
   
   // ���O�̓o�^
   printf("Input your name:");
   scanf("%9s", rank[4].name);
   rank[4].score=100;
   // ��������
   fp=fopen ("rank.txt","w");
   for (i=0 ; i<5; i++) {
      fprintf(fp,"%d %s\n", rank[i].score, rank[i].name);
   }
   fclose (fp);
}
*/
