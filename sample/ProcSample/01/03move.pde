int x=20;
void setup() {  
    background(255);
    size(300, 300); 
    rect(x,20,100,100);
} 

void draw() {
    rect(x,20,100,100);
	x+=2;
}
