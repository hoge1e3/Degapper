package jp.tonyu.js;

import java.io.File;
import java.io.IOException;
import java.util.Vector;

import jp.tonyu.debug.Log;
import jp.tonyu.util.SFile;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class JSFileRunner {
    Context ctx;
    Scriptable root;
    Vector<SFile> path=new Vector<SFile>();
    public JSFileRunner()  {
        ctx=Context.enter();
        root=ctx.initStandardObjects();
        ScriptableObject.putProperty(root, "sys", this);
        ScriptableObject.putProperty(root, "console", this);

    }
    public void log(Object s) {
        Log.d("log", s);
    }
    public void close() {
        Context.exit();
    }
    public Object load(SFile file) throws IOException {
        return ctx.evaluateString(root, file.text(), file.fullPath(), 1, null);
    }
    public void addPath(String pathp) {
        for (String p:pathp.split(";")) {
            path.add(new SFile(p));
        }
    }
    public SFile findPath(String filePath) {
        SFile res= new SFile(filePath);
        if (res.exists()) return res;
        for (SFile p:path) {
            res=p.rel(filePath);
            if (res.exists()) return res;
        }
        return null;
    }
    public Object load(String fileName) throws IOException {
        SFile p=findPath(fileName);
        if (p==null) throw new RuntimeException("Path "+fileName+" not found in "+path);
        return load(p);
    }
    public String fileText(String fileName) throws IOException {
        return new SFile(fileName).text();
    }
    public Object call(Function f,Scriptable self,Object... args) {
        return f.call(ctx, root, self, args);
    }
    public Object call(Function f, Object...args ) {
        return call(f, root, args);
    }
    public void addPath(SFile rel) {
        path.add(rel);
    }
}
