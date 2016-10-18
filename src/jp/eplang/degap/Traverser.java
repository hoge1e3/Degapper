package jp.eplang.degap;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.mozilla.javascript.Function;

import jp.tonyu.debug.Log;
import jp.tonyu.js.JSFileRunner;
import jp.tonyu.util.ArgsOptions;
import jp.tonyu.util.SFile;

public class Traverser  extends JSFileRunner{
    String extension;
    Function parseFunc;
    String encoding;
    //ArgsOptions opt;
    Set<String> excludes=new HashSet<String>();
    public Traverser(String extension, String encoding, Function parseFunc, ArgsOptions opt) {
        super();
        this.extension=extension;
        this.encoding=encoding;
        this.parseFunc=parseFunc;
        if (opt!=null) {
        	String[] exs=opt.getString("excludes","").split(";");
        	for (String ex:exs) excludes.add(ex);
        	System.out.println("EX:"+excludes);
        }
    }
    public Object parse(String src) {
        Object res=call(parseFunc, src);
        return res;
    }
    public boolean isSuccess(Object res) {
        return !res.toString().startsWith("ERROR");
    }
    public void traverse(SFile file) throws IOException {
    	//Log.d("debug", file+ " / ext="+extension);
    	if (excludes.contains(file.name())) return;
        if (file.isDir()) {
            for (SFile f:file) {
                traverse(f);
            }
        } else if (file.name().endsWith(extension)) {
            try {
                System.out.println("Parse "+file);
                String src=file.textEnc(encoding);
                if (src==null) {
                	System.out.println(file+" is null enc="+encoding);
                	System.exit(1);
                }
                Object res=parse(Preprocessor.run(src));
                if (isSuccess(res)) {
                    errorFile(file).delete();
                    xmlFile(file).text(res+"");
                } else {
                    errorFile(file).text("----Error message----\n"+res+"\n----Original source----------\n"+src);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    private SFile errorFile(SFile f) {
        return xmlDir(f).rel("!ERROR_"+f.name()+".txt");
    }
    private SFile xmlFile(SFile f) {
        return xmlDir(f).rel(f.name()+".xml");
    }
    private SFile xmlDir(SFile f) {
        return f.parent().rel("xml");
    }
}
