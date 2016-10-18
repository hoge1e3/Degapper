package jp.eplang.degap;
import java.util.TreeSet;

import org.eclipse.jetty.xml.XmlParser.Node;


public class PathChecker {
    TreeSet<Path> paths=new TreeSet<Path>();
    public PathChecker(boolean truncSingleList) {
        this.truncSingleList=truncSingleList;
    }
    boolean truncSingleList;//=false;
    public void traverse(Path path, Node n) {
        String tn = n.getTag();
        Path addedPath;
        if (truncSingleList && tn.endsWith("-list")) {
            int c=0;
            for (Object e:n) {
                if (e instanceof Node) {
                    c++;
                }
            }
            if (c<2) {
                addedPath=path;
            } else {
                addedPath=path.clone().add(tn);
            }
        } else {
            addedPath=(tn.length()>0 ? path.clone().add(tn) : path);
        }
        //System.out.println("P:"+addedPath);
        //if (!path.endWithAttr()) {
            if (paths.contains(addedPath)) {
                //paths.add(path.clone().plural());
            } else {
                paths.add(addedPath);
            }
        //}
        for (Object e:n) {
            if (e instanceof Node) {
                Node sn = (Node) e;
                //String tn=sn.getTag();
                //if (tn.equals("add") || tn.equals("mul")) tn="arithmetic";
                traverse(/*path.clone().add(tn)*/addedPath , sn);
            } else {
                //System.out.println("ELEM- "+e);
            }
        }

    }
}
