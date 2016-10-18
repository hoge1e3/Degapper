package jp.eplang.degap.command;

import java.io.IOException;

import jp.eplang.degap.Preprocessor;
import jp.eplang.degap.Traverser;
import jp.tonyu.js.JSFileRunner;
import jp.tonyu.util.ArgsOptions;
import jp.tonyu.util.SFile;

import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;



public class AnyParser extends JSFileRunner{
	String lang,ext;
	Scriptable parserScriptable;
	public boolean xmlPositinSensitive=true;
    public AnyParser(String lang) throws IOException {
    	super();
    	this.lang=ext=lang;
    	parserScriptable=getParserScriptable();
    	Object ex=ScriptableObject.getProperty(parserScriptable, "extension");
    	if (ex instanceof String) ext=ex.toString();
    	Object se=ScriptableObject.getProperty(parserScriptable, "xmlPositionSensitve");
    	if (se instanceof Boolean) {
			Boolean b = (Boolean) se;
			xmlPositinSensitive=b;
		}
    }
    public void parse(SFile dir, ArgsOptions opt) throws IOException{
        Function parse=(Function)ScriptableObject.getProperty(parserScriptable, "parse");
        Traverser tr=new Traverser("."+ext, SFile.ENC_AUTO, parse, opt);
        tr.traverse(dir);
    }
	private Scriptable getParserScriptable() throws IOException {
		JSFileRunner jsf=new JSFileRunner();
        System.out.println("lang="+lang);
        SFile parserFile = new SFile("js").rel("parser").rel(lang+".js");
		Scriptable langp=(Scriptable)jsf.load(parserFile);
		System.out.println("langp="+langp);
		for (Object o:  langp.getIds()) System.out.println(" var = "+o);
		return langp;
	}
    public static void main(ArgsOptions ar) throws IOException {
        new AnyParser(ar.args[1]).parse(new SFile(ar.args[0]),ar);
    }
	// AnyParser dir lang -exclude=name1:name2:....
    public static void main(String[] args) throws IOException {
        ArgsOptions ar=new ArgsOptions(args);
        main(ar);
    }
}
