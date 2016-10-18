package jp.eplang.degap.command;

import java.io.IOException;

import jp.tonyu.js.JSFileRunner;
import jp.tonyu.util.SFile;

public class RunJS {
    public static void main(String[] args) throws IOException {
    	//SFile s = new SFile("../c_text/asada/ex501.c");
    	//SFile s = new SFile("C:/bin/Downloads/4.c");
    	//System.out.println( s.textEnc(SFile.ENC_AUTO) );
        SFile s = new SFile(args[0]);
        JSFileRunner jsf=new JSFileRunner();
        jsf.load(s);
    }
}
