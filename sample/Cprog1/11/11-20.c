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


void writeRank(int rank[]) {
  int i;
  // ここにプログラムを書く
  FILE* fp;
  fp=fopen("rank.txt", "w");
  for (i=0 ; i<5 ; i++) {
     fprintf(fp, "%d\n", rank[i]);
  }
}
void sortRank(int rank[]) {
  int i,j;
  for (j=0 ; j<5 ;  j++) {
    for (i=0 ; i<4 ;  i++) {
      if (rank[i]<rank[i+1]) {
	int c=rank[i];
	rank[i]=rank[i+1];
	rank[i+1]=c;
      }
    }
  }
}
int main () {
   int rank[5];
   readRank(rank);
   sortRank(rank);
   writeRank(rank);
}

