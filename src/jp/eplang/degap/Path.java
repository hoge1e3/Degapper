package jp.eplang.degap;
import java.util.Vector;

import jp.tonyu.util.SFile;


public class Path implements Comparable {
    private static final String ATTR_PREFIX="attr_"; // Same as parse_c.js
    public Path clone()  {
        Path res=new Path();//learnedAt);
        res.path.addAll(path);
        res.plural=plural;
        return res;
    }
    /*public Path(SFile learnedAt) {
        this.learnedAt=learnedAt;
    }*/
    Vector<String> path=new Vector<String>();
    //SFile learnedAt;
    boolean plural=false;
    //Path superPath;
    public Path add(String pathElement) {
        //if (pathElement.startsWith("_")) return this;
        path.add(pathElement);
        return this;
    }
    @Override
    public String toString() {
        StringBuilder b=new StringBuilder();
        for (String e:path) {
            //if (!e.startsWith("_")) {
                b.append("/"+e);
            //}
        }
        return b.toString()+(plural?"(2)":"");
    }
    @Override
    public int hashCode() {
        return toString().hashCode();
    }
    @Override
    public boolean equals(Object arg0) {
        return toString().equals(arg0+"");
    }
    public Path plural() {
        plural=true;
        return this;
    }
    @Override
    public int compareTo(Object arg0) {
        return toString().compareTo(arg0+"");
    }
    public boolean endWithAttr() {
        if (path.size()==0) return false;
        return path.lastElement().startsWith(ATTR_PREFIX);
    }
    public Path removeLast() {
        path.removeElementAt(path.size()-1);
        return this;
    }
    public boolean isEmpty() {
        return path.isEmpty();
    }
    public int size() {
        return path.size();
    }
    public Path removeAt(int p) {
        path.removeElementAt(p);
        return this;
    }
    public Path subpath(int start) {
        for (int i=0; i<start; i++) {
            removeAt(0);
        }
        return this;
    }
    public String get(int i) {
    	return path.get(i);
    }
    public boolean isSubpathOf(Path p) {
    	for (int i=0 ; i< size() ; i++) {
    		if (i>=p.size()) return false;
    		if (! get(i).equals(p.get(i))) {
    			return false;
    		}
    	}
    	//superPath=p;
    	//System.out.println(this +" is subpath of "+p);
    	return true;
    }
}
