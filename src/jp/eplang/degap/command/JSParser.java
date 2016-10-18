package jp.eplang.degap.command;

import java.io.IOException;

import jp.eplang.degap.Preprocessor;
import jp.eplang.degap.Traverser;
import jp.tonyu.js.JSFileRunner;
import jp.tonyu.util.SFile;

import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;



public class JSParser extends JSFileRunner{
    public JSParser() throws IOException {
        super();

    }
    public static void main(String[] args) throws IOException {
        JSFileRunner jsf=new JSFileRunner();
        SFile jsparser=new SFile("js/parse_js.js");
        Scriptable lang=(Scriptable)jsf.load(jsparser);
        Function parse=(Function)ScriptableObject.getProperty(lang, "parse");
        Object res=jsf.call(parse, jsparser.text());
        System.out.println(res);
        //Traverser tr=new Traverser(".java", "utf8", parse);
        //tr.traverse(new SFile(args[0]));
    }
}
