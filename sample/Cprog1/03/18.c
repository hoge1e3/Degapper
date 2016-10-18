#include<stdio.h>
#include<stdlib.h>
#include<time.h>
int main(void){
	int answer,input;
	srand( time(NULL));
	answer =rand()%100;
	while(1){
		printf("”Žš‚ð“ü—Í‚µ‚Ä‚ ‚Ä‚Ä‚­‚¾‚³‚¢\n");
		scanf("%d",&input);
		if(input==answer){
			printf("‚ ‚½‚è\n");
			break;
		}
		if(input>answer){
			printf("‘å‚«‚¢\n");
		}
		if(input<answer){
			printf("¬‚³‚¢\n");
		}
	}
}
