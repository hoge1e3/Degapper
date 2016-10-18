package jp.tonyu.util;

import java.io.IOException;

import org.mozilla.javascript.Function;


import jp.eplang.degap.Preprocessor;
import jp.tonyu.js.JSFileRunner;

public class Test {
    public static void main(String[] args) throws IOException {
        JSFileRunner j=new JSFileRunner();
        parse=(Function)j.load("js/parse_c2.js");
        Object res=parse(j, Preprocessor.run(
                new SFile("C:/Users/shinya/Dropbox/cej1203nishidaLangedu/c_text/KandR/src-seq/012.c").text() ) );
        //System.out.println(res);
    }
    static Function parse;
    public static Object parse(JSFileRunner j,String src) {
        Object res=j.call(parse, src);
        return res;
    }
}
